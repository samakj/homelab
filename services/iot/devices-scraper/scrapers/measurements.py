from decimal import Decimal
import re
from typing import Optional, Set
from pydantic import BaseModel
from fastapi import HTTPException
from datetime import datetime

from login import login
from shared.python.extensions.speedyapi import SpeedyAPI, Logger
from shared.python.clients.iot import IoTClient
from shared.python.extensions.websocket import (
    Websocket,
    WebsocketMeta,
    WebsocketMessageHandler,
)
from shared.python.models.device import Device
from shared.python.models.location import Location
from shared.python.models.measurement import ValueType, ValueTypeOptions
from shared.python.models.metric import Metric
from shared.python.json import parse_json


class MeasurementWebsocketMessage(BaseModel):
    metric: str
    message: ValueType
    mac: str
    tags: Optional[list[str]] = None
    timestamp: Optional[str] = None


class MeasurementWebsocketMessageHandler(WebsocketMessageHandler):  # type: ignore
    app: SpeedyAPI
    iot_client: IoTClient

    def __init__(self, app: SpeedyAPI) -> None:
        super().__init__(logger=app.logger)
        self.app = app
        self.iot_client = app.iot_client

    async def __call__(self, raw_message: str) -> None:
        try:
            data = parse_json(raw_message)
        except Exception as error:
            self.logger.error("Failed parse json from:")
            self.logger.error(f"\t{raw_message}")
            self.logger.error(str(error))
            return

        try:
            message = MeasurementWebsocketMessage.parse_obj(data)
        except Exception as error:
            self.logger.error("Failed to parse raw message object from:")
            self.logger.error(f"\t{raw_message}")
            self.logger.error(str(error))
            return

        try:
            timestamp = (
                datetime.fromisoformat(message.timestamp.replace("Z", ""))
                if message.timestamp is not None
                else datetime.utcnow()
            )
        except Exception as error:
            self.logger.error("Failed to parse timestamp from message:")
            self.logger.error(f"\t{message}")
            self.logger.error(str(error))
            return

        try:
            device = await self.iot_client.devices.get_device_by_mac_or_ip(
                mac_or_ip=message.mac
            )
        except Exception as error:
            if isinstance(error, HTTPException) and error.status_code in {401, 403}:
                self.logger.error("Auth failed trying to re log in.")
                await login(app=self.app)
                await self.__call__(raw_message=raw_message)
                return

            self.logger.error("Failed get device for message:")
            self.logger.error(f"\t{message}")
            self.logger.error(
                f"{error.status_code}: {error.detail}"
                if isinstance(error, HTTPException)
                else str(error)
            )
            return

        if message.metric != "ping":
            try:
                metric = await self.iot_client.metrics.get_metric_by_name(
                    name=message.metric
                )
            except Exception as error:
                if isinstance(error, HTTPException) and error.status_code in {401, 403}:
                    self.logger.error("Auth failed trying to re log in.")
                    await login(app=self.app)
                    await self.__call__(raw_message=raw_message)
                    return

                self.logger.error("Failed to get metric for message:")
                self.logger.error(f"\t{message}")
                self.logger.error(
                    f"{error.status_code}: {error.detail}"
                    if isinstance(error, HTTPException)
                    else str(error)
                )
                return

            try:
                location = await self.iot_client.locations.get_location(
                    id=device.location_id
                )
            except Exception as error:
                if isinstance(error, HTTPException) and error.status_code in {401, 403}:
                    self.logger.error("Auth failed trying to re log in.")
                    await login(app=self.app)
                    await self.__call__(raw_message=raw_message)
                    return

                self.logger.error("Failed to get location for message:")
                self.logger.error(f"\t{message}")
                self.logger.error(
                    f"{error.status_code}: {error.detail}"
                    if isinstance(error, HTTPException)
                    else str(error)
                )
                return

            value = message.message
            value_type: ValueTypeOptions = "string"

            if isinstance(message.message, int):
                value_type = "integer"
                value = int(message.message)
            if isinstance(message.message, str) and re.search(
                "^[-+]?\d+$", message.message
            ):
                value_type = "integer"
                value = int(message.message)
            if isinstance(message.message, float) or isinstance(
                message.message, Decimal
            ):
                value_type = "float"
                value = Decimal(message.message)
            if isinstance(message.message, str) and re.search(
                "^[-+]?\d*.\d*$", message.message
            ):
                value_type = "float"
                value = Decimal(message.message)
            if isinstance(message.message, bool):
                value_type = "boolean"
                value = bool(message.message)
            if isinstance(message.message, str) and message.message.lower() in {
                "true",
                "false",
            }:
                value_type = "boolean"
                message.message = message.message.lower() == "true"

            if isinstance(value, Decimal):
                if metric.name in {"temperature", "humidity", "percentage"}:
                    value = round(value, 1)

            try:
                latest = await self.iot_client.measurements.get_latest_measurements(
                    location_id=location.id,
                    metric_id=metric.id,
                    device_id=device.id,
                    tags=message.tags,
                )
            except Exception as error:
                self.logger.error("Failed to get latest from message:")
                self.logger.error(f"\t{message}")
                self.logger.error(str(error))
                return

            if len(latest) > 1:
                self.logger.error(
                    "Latest message endpoint returned multiple messages, using first one"
                )

            self.logger.info(
                "{:<18} | {:<12} | {:<32} | {:<8} | {}{} -> {}{} {}".format(
                    location.name,
                    metric.name,
                    ", ".join(message.tags),
                    value_type,
                    latest[0].value if latest else "-",
                    metric.unit or "",
                    value,
                    metric.unit or "",
                    "" if not latest or latest[0].value != value else "(unchanged)",
                )
            )

            if not latest or latest[0].value != value:
                try:
                    await self.iot_client.measurements.create_measurement(
                        timestamp=timestamp,
                        metric_id=metric.id,
                        device_id=device.id,
                        location_id=location.id,
                        tags=message.tags,
                        value_type=value_type,
                        value=value,
                    )
                except Exception as error:
                    if isinstance(error, HTTPException) and error.status_code in {
                        401,
                        403,
                    }:
                        self.logger.error("Auth failed trying to re log in.")
                        await login(app=self.app)
                        await self.__call__(raw_message=raw_message)
                        return

                    self.logger.error("Failed to create measurment for message:")
                    self.logger.error(f"\t{message}")
                    self.logger.error(
                        f"{error.status_code}: {error.detail}"
                        if isinstance(error, HTTPException)
                        else str(error)
                    )
                    return
            else:
                self.logger.warning(
                    "Latest message has same value as new message, skipping new message"
                )

        try:
            device = await self.iot_client.devices.update_device(
                device=Device(
                    id=device.id,
                    mac=device.mac,
                    ip=device.ip,
                    websocket_path=device.websocket_path,
                    location_id=device.location_id,
                    last_message=timestamp,
                )
            )
        except Exception as error:
            if isinstance(error, HTTPException) and error.status_code in {401, 403}:
                self.logger.error("Auth failed trying to re log in.")
                await login(app=self.app)
                await self.__call__(raw_message=raw_message)
                return

            self.logger.error("Failed to update device for message:")
            self.logger.error(f"\t{message}")
            self.logger.error(str(error))
            self.logger.error(
                f"{error.status_code}: {error.detail}"
                if isinstance(error, HTTPException)
                else str(error)
            )
            return


class MeasurementScraper:
    app: SpeedyAPI
    iot_client: IoTClient
    watching: Set[int]
    devices: dict[int, Device]
    locations: dict[int, Location]
    metrics: dict[int, Metric]
    websockets: dict[int, Websocket]
    message_handler: MeasurementWebsocketMessageHandler
    logger: Logger

    def __init__(self, app: SpeedyAPI) -> None:
        self.app = app
        self.iot_client = app.iot_client
        self.watching = set()
        self.devices = {}
        self.locations = {}
        self.metrics = {}
        self.websockets = {}
        self.message_handler = MeasurementWebsocketMessageHandler(app=app)
        self.logger = app.logger

    async def watch(self, device_id: int) -> WebsocketMeta:
        websocket = self.websockets.get(device_id)

        if websocket is None:
            device = await self.iot_client.devices.get_device(id=device_id)
            self.websockets[device.id] = Websocket(
                url=f"ws://{device.ip}{device.websocket_path}",
                handler=self.message_handler,
                logger=self.logger,
            )
            websocket = self.websockets[device.id]

        await websocket.listen()
        return websocket.meta

    async def unwatch(self, device_id: int) -> WebsocketMeta:
        websocket = self.websockets.get(device_id)

        if websocket is None:
            device = await self.iot_client.devices.get_device(id=device_id)
            self.websockets[device.id] = Websocket(
                url=f"ws://{device.ip}{device.websocket_path}",
                handler=self.message_handler,
            )
            websocket = self.websockets[device.id]

        await websocket.disconnect()
        return websocket.meta

    async def unwatch_all(self) -> None:
        for device_id in self.websockets.keys():
            await self.unwatch(device_id=device_id)
