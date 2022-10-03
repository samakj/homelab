from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.json import to_json_serialisable
from shared.python.extensions.httpy import (
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.location import Location


class LocationsClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "LocationsClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return LocationsClient(base_url=base_url, http_client=client)

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

    async def get_location(self, id: int) -> Location:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/locations/{id}")
            data = response.json()
            return Location.parse_obj(data)

    async def get_location_by_name(self, name: str) -> Location:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/locations/{name}")
            data = response.json()
            return Location.parse_obj(data)

    async def get_locations(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> list[Location]:
        params = {}

        if id is not None:
            params["id"] = id
        if name is not None:
            params["name"] = name
        if tags is not None:
            params["tags"] = tags

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/locations",
                params=params,
            )
            data = response.json()
            return [Location.parse_obj(location) for location in data]

    async def create_location(
        self,
        name: str,
        tags: list[str] = [],
    ) -> Location:
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/locations",
                json=to_json_serialisable(
                    {
                        "name": name,
                        "tags": tags,
                    }
                ),
            )
            data = response.json()
            return Location.parse_obj(data)

    async def update_location(
        self,
        location: Location,
    ) -> Location:
        async with self.http_client() as http:
            response = await http.patch(
                f"{self.base_url}/v0/locations/{location.id}",
                data=location.json(encoder=to_json_serialisable),
            )
            data = response.json()
            return Location.parse_obj(data)

    async def delete_location(
        self,
        id: int,
    ) -> Location:
        async with self.http_client() as http:
            await http.delete(f"{self.base_url}/v0/locations/{id}")
            return None
