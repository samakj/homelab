from datetime import datetime
import json
from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends

from shared.python.models.measurement import Measurement, CreateMeasurement, ValueType
from shared.python.extensions.speedyapi.websockets import Websockets
from stores.queries.measurements import (
    GET_MEASUREMENT_BY_ID,
    GET_MEASUREMENTS,
    GET_LATEST_MEASUREMENTS,
    CREATE_MEASUREMENT,
    CREATE_MEASUREMENT_VALUE,
)
from shared.python.extensions.speedyapi.database import Database
from shared.python.helpers.to_filter import to_filter, to_array_filter


class MeasurementsStore:
    connection: Connection
    websockets: Websockets

    def __init__(
        self,
        connection: Connection = Depends(Database.transaction),
        websockets: Websockets = Depends(Websockets),
    ) -> None:
        self.connection = connection
        self.websockets = websockets

    async def get_measurement(self, id: int) -> Optional[Measurement]:
        response = await self.connection.fetchrow(
            GET_MEASUREMENT_BY_ID.format(id=to_filter(id))
        )

        if response is None:
            return None

        row = dict(response)
        row["value"] = row.get(f"{row['value_type']}_value")

        return Measurement.parse_obj(row)

    async def get_measurements(
        self,
        id: Optional[Union[int, list[int]]] = None,
        device_id: Optional[Union[int, list[int]]] = None,
        metric_id: Optional[Union[int, list[int]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
        timestamp_gte: Optional[datetime] = None,
        timestamp_lte: Optional[datetime] = None,
        value: Optional[ValueType] = None,
        value_gte: Optional[ValueType] = None,
        value_lte: Optional[ValueType] = None,
    ) -> Optional[list[Measurement]]:
        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")
        if device_id is not None:
            where.append(f"device_id IN {to_array_filter(device_id)}")
        if metric_id is not None:
            where.append(f"metric_id IN {to_array_filter(metric_id)}")
        if location_id is not None:
            where.append(f"location_id IN {to_array_filter(location_id)}")
        if tags is not None:
            where.append(f"tags @> {to_array_filter(tags)}")
        if timestamp_gte is not None:
            where.append(f"timestamp >= {to_filter(timestamp_gte)}")
        if timestamp_lte is not None:
            where.append(f"timestamp <= {to_filter(timestamp_lte)}")
        if value is not None:
            where.append(f"value = {to_filter(value)}")
        if value_gte is not None:
            where.append(f"value >= {to_filter(value_gte)}")
        if value_lte is not None:
            where.append(f"value <= {to_filter(value_lte)}")

        response = await self.connection.fetch(
            GET_MEASUREMENTS.format(where=" AND ".join(where) if where else "TRUE")
        )

        rows: list[Measurement] = []

        for row in response:
            _row = dict(row)
            _row["value"] = _row.get(f"{row['value_type']}_value")

            if (
                (value is not None and _row["value"] != value)
                or (value_gte is not None and _row["value"] < value_gte)
                or (value_lte is not None and _row["value"] > value_lte)
            ):
                continue

            rows.push(Measurement.parse_obj(_row))

        return rows

    async def get_latest_measurements(
        self,
        device_id: Optional[Union[int, list[int]]] = None,
        metric_id: Optional[Union[int, list[int]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> Optional[list[Measurement]]:
        where = []

        if device_id is not None:
            where.append(f"device_id IN {to_array_filter(device_id)}")
        if metric_id is not None:
            where.append(f"metric_id IN {to_array_filter(metric_id)}")
        if location_id is not None:
            where.append(f"location_id IN {to_array_filter(location_id)}")
        if tags is not None:
            where.append(f"tags @> {to_array_filter(tags)}")

        response = await self.connection.fetch(
            GET_LATEST_MEASUREMENTS.format(
                where=" AND ".join(where) if where else "TRUE"
            )
        )

        rows: list[Measurement] = []

        for row in response:
            _row = dict(row)
            _row["value"] = _row.get(f"{row['value_type']}_value")
            rows.push(Measurement.parse_obj(_row))

        return rows

    async def create_measurement(
        self,
        measurement: CreateMeasurement,
    ) -> Optional[Measurement]:
        row = await self.connection.fetchrow(
            CREATE_MEASUREMENT.format(
                timestamp=to_filter(measurement.timestamp),
                device_id=to_filter(measurement.device_id),
                location_id=to_filter(measurement.location_id),
                metric_id=to_filter(measurement.metric_id),
                tags=to_array_filter(measurement.tags),
                value_type=to_filter(measurement.value_type),
            )
        )
        await self.connection.execute(
            CREATE_MEASUREMENT_VALUE.format(
                measurement_id=row["id"],
                value_type=measurement.value_type,
                value=to_filter(measurement.value),
            )
        )

        response = await self.get_measurement(id=row["id"])

        if response is None:
            return None

        await self.websockets.broadcast_to_scope(
            "measurements.create",
            json.dumps(
                {
                    "action": "CREATE",
                    "measurement": response.json(),
                }
            ),
        )

        return response
