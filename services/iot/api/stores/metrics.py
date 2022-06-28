from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends

from shared.python.models.metric import Metric, CreateMetric
from stores.queries.metrics import (
    GET_METRIC_BY_ID,
    GET_METRIC_BY_NAME,
    GET_METRIC_BY_ABBREVIATION,
    GET_METRICS,
    CREATE_METRIC,
    UPDATE_METRIC,
    DELETE_METRIC,
)
from shared.python.extensions.speedyapi.database import Database
from shared.python.helpers.to_filter import to_filter, to_array_filter


class MetricsStore:
    connection: Connection

    def __init__(self, connection: Connection = Depends(Database.transaction)) -> None:
        self.connection = connection

    async def get_metric(self, id: int) -> Optional[Metric]:
        response = await self.connection.fetchrow(
            GET_METRIC_BY_ID.format(id=to_filter(id))
        )
        return Metric(**dict(response)) if response is not None else None

    async def get_metric_by_name(self, name: str) -> Optional[Metric]:
        response = await self.connection.fetchrow(
            GET_METRIC_BY_NAME.format(name=to_filter(name))
        )
        return Metric(**dict(response)) if response is not None else None

    async def get_metric_by_abbreviation(self, abbreviation: str) -> Optional[Metric]:
        response = await self.connection.fetchrow(
            GET_METRIC_BY_ABBREVIATION.format(abbreviation=to_filter(abbreviation))
        )
        return Metric(**dict(response)) if response is not None else None

    async def get_metrics(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        abbreviation: Optional[Union[str, list[str]]] = None,
        unit: Optional[Union[str, list[str]]] = None,
    ) -> Optional[list[Metric]]:
        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")
        if name is not None:
            where.append(f"name IN {to_array_filter(name)}")
        if abbreviation is not None:
            where.append(f"abbreviation IN {to_array_filter(abbreviation)}")
        if unit is not None:
            where.append(f"unit IN {to_array_filter(unit)}")

        response = await self.connection.fetch(
            GET_METRICS.format(where=" AND ".join(where) if where else "TRUE")
        )

        return [Metric(**dict(row)) for row in response]

    async def create_metric(
        self,
        metric: CreateMetric,
    ) -> Optional[Metric]:
        row = await self.connection.fetchrow(
            CREATE_METRIC.format(
                name=to_filter(metric.name),
                abbreviation=to_filter(metric.abbreviation),
                unit=to_filter(metric.unit),
            )
        )
        return await self.get_metric(id=row["id"])

    async def update_metric(self, metric: Metric) -> Optional[Metric]:
        await self.connection.execute(
            UPDATE_METRIC.format(
                id=to_filter(metric.id),
                name=to_filter(metric.name),
                abbreviation=to_filter(metric.abbreviation),
                unit=to_filter(metric.unit),
            )
        )
        return await self.get_metric(id=metric.id)

    async def delete_metric(self, id: int) -> None:
        await self.connection.execute(DELETE_METRIC.format(id=to_filter(id)))
