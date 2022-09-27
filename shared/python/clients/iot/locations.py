from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.location import Location


class LocationsClient:
    client: AsyncInternalClient
    base_url: str

    def __init__(
        self,
        http_connection: HTTPConnection,
        client: AsyncInternalRequestClient = Depends(AsyncInternalRequestClient()),
    ) -> None:
        self.client = client

        self.base_url = http_connection.app.config.get("urls", {}).get("iot_api")
        if self.base_url is None:
            raise ValueError("config.urls.iot_api not set.")

    async def get_location(self, id: int) -> Location:
        response = await self.client.get(f"{self.base_url}/v0/locations/{id}")
        data = response.json()
        return Location.parse_obj(data)

    async def get_location_by_name(self, name: str) -> Location:
        response = await self.client.get(f"{self.base_url}/v0/locations/{name}")
        data = response.json()
        return Location.parse_obj(data)

    async def get_locations(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> list[Location]:
        response = await self.client.get(
            f"{self.base_url}/v0/locations",
            params={
                "id": id,
                "name": name,
                "tags": tags,
            },
        )
        data = response.json()
        return [Location.parse_obj(location) for location in data]

    async def create_location(
        self,
        name: str,
        tags: list[str] = [],
    ) -> Location:
        response = await self.client.post(
            f"{self.base_url}/v0/locations",
            data={
                "name": name,
                "tags": tags,
            },
        )
        data = response.json()
        return Location.parse_obj(data)

    async def update_location(
        self,
        location: Location,
    ) -> Location:
        response = await self.client.patch(
            f"{self.base_url}/v0/locations/{location.id}",
            data=dict(location),
        )
        data = response.json()
        return Location.parse_obj(data)

    async def delete_location(
        self,
        id: int,
    ) -> Location:
        await self.client.delete(f"{self.base_url}/v0/locations/{id}")
        return None
