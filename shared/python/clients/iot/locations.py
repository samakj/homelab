from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.location import Location


class LocationsClient:
    client: AsyncInternalClient
    base_url: str

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "LocationsClient":
        base_url = connection.app.config.get("urls", {}).get("iot_api")
        if base_url is None:
            raise ValueError("config.urls.iot_api not set.")

        return LocationsClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

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
            json={
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
            json=dict(location),
        )
        data = response.json()
        return Location.parse_obj(data)

    async def delete_location(
        self,
        id: int,
    ) -> Location:
        await self.client.delete(f"{self.base_url}/v0/locations/{id}")
        return None
