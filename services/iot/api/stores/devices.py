from datetime import datetime
import json
from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends

from shared.python.models.device import Device, CreateDevice
from stores.queries.devices import (
    GET_DEVICE_BY_ID,
    GET_DEVICE_BY_MAC,
    GET_DEVICE_BY_IP,
    GET_DEVICES,
    CREATE_DEVICE,
    UPDATE_DEVICE,
    DELETE_DEVICE,
)
from shared.python.extensions.speedyapi.database import Database
from shared.python.extensions.speedyapi.websockets import Websockets
from shared.python.helpers.to_filter import to_filter, to_array_filter


class DevicesStore:
    connection: Connection
    websockets: Websockets

    def __init__(
        self,
        connection: Connection = Depends(Database.transaction),
        websockets: Websockets = Depends(Websockets),
    ) -> None:
        self.connection = connection
        self.websockets = websockets

    async def get_device(self, id: int) -> Optional[Device]:
        response = await self.connection.fetchrow(
            GET_DEVICE_BY_ID.format(id=to_filter(id))
        )
        return Device(**dict(response)) if response is not None else None

    async def get_device_by_mac(self, mac: str) -> Optional[Device]:
        response = await self.connection.fetchrow(
            GET_DEVICE_BY_MAC.format(mac=to_filter(mac))
        )
        return Device(**dict(response)) if response is not None else None

    async def get_device_by_ip(self, ip: str) -> Optional[Device]:
        response = await self.connection.fetchrow(
            GET_DEVICE_BY_IP.format(ip=to_filter(ip))
        )
        return Device(**dict(response)) if response is not None else None

    async def get_devices(
        self,
        id: Optional[Union[int, list[int]]] = None,
        mac: Optional[Union[str, list[str]]] = None,
        ip: Optional[Union[str, list[str]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        last_message_gte: Optional[datetime] = None,
        last_message_lte: Optional[datetime] = None,
        last_message_null: Optional[bool] = None,
    ) -> Optional[list[Device]]:
        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")
        if mac is not None:
            where.append(f"mac IN {to_array_filter(mac)}")
        if ip is not None:
            where.append(f"ip IN {to_array_filter(ip)}")
        if location_id is not None:
            where.append(f"location_id IN {to_array_filter(location_id)}")
        if last_message_gte is not None:
            where.append(f"last_message >= {to_filter(last_message_gte)}")
        if last_message_lte is not None:
            where.append(f"last_message <= {to_filter(last_message_lte)}")
        if last_message_null:
            where.append("last_message = NULL")

        response = await self.connection.fetch(
            GET_DEVICES.format(where=" AND ".join(where) if where else "TRUE")
        )

        return [Device(**dict(row)) for row in response]

    async def create_device(
        self,
        device: CreateDevice,
    ) -> Optional[Device]:
        row = await self.connection.fetchrow(
            CREATE_DEVICE.format(
                mac=to_filter(device.mac),
                ip=to_filter(device.ip),
                websocket_path=to_filter(device.websocket_path),
                location_id=to_filter(device.location_id),
                last_message=to_filter(device.last_message),
            )
        )
        return await self.get_device(id=row["id"])

    async def update_device(self, device: Device) -> Optional[Device]:
        await self.connection.execute(
            UPDATE_DEVICE.format(
                id=to_filter(device.id),
                mac=to_filter(device.mac),
                ip=to_filter(device.ip),
                websocket_path=to_filter(device.websocket_path),
                location_id=to_filter(device.location_id),
                last_message=to_filter(device.last_message),
            )
        )
        response = await self.get_device(id=device.id)

        if response is None:
            return None

        await self.websockets.broadcast_to_scope(
            "devices.update",
            json.dumps(
                {
                    "action": "UPDATE",
                    "resource": "device",
                    "device": response.json(),
                    "oldDevice": device.json(),
                }
            ),
        )

        return response

    async def delete_device(self, id: int) -> None:
        await self.connection.execute(DELETE_DEVICE.format(id=to_filter(id)))
