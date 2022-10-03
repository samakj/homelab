from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends

from shared.python.models.location import Location, CreateLocation
from stores.queries.locations import (
    GET_LOCATION_BY_ID,
    GET_LOCATION_BY_NAME,
    GET_LOCATIONS,
    CREATE_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION,
)
from shared.python.extensions.speedyapi.database import Database
from shared.python.helpers.to_filter import to_filter, to_array_filter, to_array_value


class LocationsStore:
    connection: Connection

    def __init__(self, connection: Connection = Depends(Database.transaction)) -> None:
        self.connection = connection

    async def get_location(self, id: int) -> Optional[Location]:
        response = await self.connection.fetchrow(
            GET_LOCATION_BY_ID.format(id=to_filter(id))
        )
        return Location(**dict(response)) if response is not None else None

    async def get_location_by_name(self, name: str) -> Optional[Location]:
        response = await self.connection.fetchrow(
            GET_LOCATION_BY_NAME.format(name=to_filter(name))
        )
        return Location(**dict(response)) if response is not None else None

    async def get_locations(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> Optional[list[Location]]:
        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")
        if name is not None:
            where.append(f"name IN {to_array_filter(name)}")
        if tags is not None:
            where.append(f"tags @> {to_array_filter(tags)}")

        response = await self.connection.fetch(
            GET_LOCATIONS.format(where=" AND ".join(where) if where else "TRUE")
        )

        return [Location(**dict(row)) for row in response]

    async def create_location(
        self,
        location: CreateLocation,
    ) -> Optional[Location]:
        row = await self.connection.fetchrow(
            CREATE_LOCATION.format(
                name=to_filter(location.name),
                tags=to_array_value(location.tags),
            )
        )
        return await self.get_location(id=row["id"])

    async def update_location(self, location: Location) -> Optional[Location]:
        await self.connection.execute(
            UPDATE_LOCATION.format(
                id=to_filter(location.id),
                name=to_filter(location.name),
                tags=to_array_value(location.tags),
            )
        )
        return await self.get_location(id=location.id)

    async def delete_location(self, id: int) -> None:
        await self.connection.execute(DELETE_LOCATION.format(id=to_filter(id)))
