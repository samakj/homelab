from typing import Optional, Union
from fastapi import Depends
from datetime import datetime
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.device import Device


class DevicesClient:
    client: AsyncInternalClient
    base_url: str

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "DevicesClient":
        base_url = connection.app.config.get("urls", {}).get("iot_api")
        if base_url is None:
            raise ValueError("config.urls.iot_api not set.")

        return DevicesClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

    async def get_device(self, id: int) -> Device:
        response = await self.client.get(f"{self.base_url}/v0/devices/{id}")
        data = response.json()
        return Device.parse_obj(data)

    async def get_device_by_mac_or_ip(self, mac_or_ip: str) -> Device:
        response = await self.client.get(f"{self.base_url}/v0/devices/{mac_or_ip}")
        data = response.json()
        return Device.parse_obj(data)

    async def get_devices(
        self,
        id: Optional[Union[int, list[int]]] = None,
        mac: Optional[Union[str, list[str]]] = None,
        ip: Optional[Union[str, list[str]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        last_message_gte: Optional[datetime] = None,
        last_message_lte: Optional[datetime] = None,
        last_message_null: Optional[bool] = None,
    ) -> list[Device]:
        response = await self.client.get(
            f"{self.base_url}/v0/devices",
            params={
                "id": id,
                "mac": mac,
                "ip": ip,
                "location_id": location_id,
                "last_message_gte": last_message_gte,
                "last_message_lte": last_message_lte,
                "last_message_null": last_message_null,
            },
        )
        data = response.json()
        return [Device.parse_obj(device) for device in data]

    async def create_device(
        self,
        mac: str,
        ip: str,
        websocket_path: str,
        location_id: int,
        last_message: Optional[datetime] = None,
    ) -> Device:
        response = await self.client.post(
            f"{self.base_url}/v0/devices",
            json={
                "mac": mac,
                "ip": ip,
                "websocket_path": websocket_path,
                "location_id": location_id,
                "last_message": last_message,
            },
        )
        data = response.json()
        return Device.parse_obj(data)

    async def update_device(
        self,
        device: Device,
    ) -> Device:
        response = await self.client.patch(
            f"{self.base_url}/v0/devices/{device.id}",
            json=dict(device),
        )
        data = response.json()
        return Device.parse_obj(data)

    async def delete_device(
        self,
        id: int,
    ) -> Device:
        await self.client.delete(f"{self.base_url}/v0/devices/{id}")
        return None
