from typing import Optional, Union
from fastapi import Depends
from datetime import datetime
from fastapi.requests import HTTPConnection

from shared.python.json import to_json_serialisable
from shared.python.extensions.httpy import (
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.device import Device


class DevicesClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "DevicesClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return DevicesClient(base_url=base_url, http_client=client)

    def __init__(
        self,
        base_url: str,
        http_client: Optional[AsyncRequestClient] = None,
        access_token: Optional[str] = None,
    ) -> None:
        self.http_client = http_client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

    def set_access_token(self, access_token: Optional[str] = None) -> None:
        self.http_client.set_access_token(access_token=access_token)

    async def get_device(self, id: int) -> Device:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/devices/{id}")
            data = response.json()
            return Device.parse_obj(data)

    async def get_device_by_mac_or_ip(self, mac_or_ip: str) -> Device:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/devices/{mac_or_ip}")
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
        params = {}

        if id is not None:
            params["id"] = id
        if mac is not None:
            params["mac"] = mac
        if ip is not None:
            params["ip"] = ip
        if location_id is not None:
            params["location_id"] = location_id
        if last_message_gte is not None:
            params["last_message_gte"] = last_message_gte.isoformat()
        if last_message_lte is not None:
            params["last_message_lte"] = last_message_lte.isoformat()
        if last_message_null is not None:
            params["last_message_null"] = last_message_null

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/devices",
                params=params,
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
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/devices",
                json=to_json_serialisable(
                    {
                        "mac": mac,
                        "ip": ip,
                        "websocket_path": websocket_path,
                        "location_id": location_id,
                        "last_message": last_message,
                    }
                ),
            )
            data = response.json()
            return Device.parse_obj(data)

    async def update_device(
        self,
        device: Device,
    ) -> Device:
        async with self.http_client() as http:
            response = await http.patch(
                f"{self.base_url}/v0/devices/{device.id}",
                data=device.json(encoder=to_json_serialisable),
            )
            data = response.json()
            return Device.parse_obj(data)

    async def delete_device(
        self,
        id: int,
    ) -> Device:
        async with self.http_client() as http:
            await http.delete(f"{self.base_url}/v0/devices/{id}")
            return None
