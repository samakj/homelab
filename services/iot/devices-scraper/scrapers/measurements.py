from typing import Optional, Set
from pydantic import BaseModel
from datetime import datetime

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


class MeasurementWebsocketMessage(BaseModel):
    metric: str
    location: str
    message: ValueType
    tags: list[str]
    mac: str
    timestamp: Optional[str] = None


class MeasurementWebsocketMessageHandler(WebsocketMessageHandler):  # type: ignore
    iot_client: IoTClient

    def __init__(self, iot_client: IoTClient) -> None:
        super().__init__()
        self.iot_client = iot_client

    async def __call__(self, raw_message: str) -> None:
        message = MeasurementWebsocketMessage.parse_obj(raw_message)
        timestamp = (
            datetime.fromisoformat(message.timestamp)
            if message.timestamp is not None
            else datetime.utcnow()
        )
        device = await self.iot_client.devices.get_device_by_mac_or_ip(
            mac_or_ip=message.mac
        )

        if message.metric != "ping":
            metric = await self.iot_client.metrics.get_metric_by_name(
                name=message.metric
            )
            location = await self.iot_client.locations.get_location_by_name(
                name=message.location
            )
            value_type: ValueTypeOptions = "string"

            if isinstance(message.message, int):
                value_type = "integer"
            if isinstance(message.message, float):
                value_type = "float"
            if isinstance(message.message, bool):
                value_type = "boolean"

            measurement = await self.iot_client.measurements.create_measurement(
                timestamp=timestamp,
                metric_id=metric.id,
                device_id=device.id,
                location_id=location.id,
                tags=message.tags,
                value_type=value_type,
                value=message.message,
            )

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

        print(measurement)


class MeasurementScraper:
    iot_client: IoTClient
    watching: Set[int]
    devices: dict[int, Device]
    locations: dict[int, Location]
    metrics: dict[int, Metric]
    websockets: dict[int, Websocket]
    message_handler: MeasurementWebsocketMessageHandler

    def __init__(self, iot_client: IoTClient) -> None:
        self.iot_client = iot_client
        self.watching = set()
        self.devices = {}
        self.locations = {}
        self.metrics = {}
        self.websockets = {}
        self.message_handler = MeasurementWebsocketMessageHandler(iot_client=iot_client)

    async def watch(self, device_id: int) -> WebsocketMeta:
        websocket = self.websockets.get(device_id)

        if websocket is None:
            device = await self.iot_client.get_device(id=device_id)
            self.websockets[device.id] = Websocket(
                url=f"ws://{device.ip}{device.websocket_path}",
                handler=self.message_handler,
            )
            websocket = self.websockets[device.id]

        await websocket.listen()
        return websocket.meta

    async def unwatch(self, device_id: int) -> WebsocketMeta:
        websocket = self.websockets.get(device_id)

        if websocket is None:
            device = await self.iot_client.get_device(id=device_id)
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
