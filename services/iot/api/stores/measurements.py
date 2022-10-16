from datetime import datetime
from decimal import Decimal
import logging
from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends
from pydantic import BaseModel, Field

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
from shared.python.helpers.to_filter import to_filter, to_array_filter, to_array_value
from shared.python.json import serialise_json

log = logging.getLogger()

LineValueType = Union[Decimal, float, int]


class ChartLinePoint(BaseModel):
    timestamp: datetime
    value: LineValueType


class ChartLine(BaseModel):
    index: int
    location_id: int
    metric_id: int
    device_id: int
    points: list[ChartLinePoint] = []
    tags: Optional[list[str]] = None
    min: Optional[LineValueType] = None
    max: Optional[LineValueType] = None
    timestamp_min: Optional[datetime] = None
    timestamp_max: Optional[datetime] = None


class MinMaxValue(BaseModel):
    min: Optional[LineValueType] = None
    max: Optional[LineValueType] = None


class MinMaxDateTime(BaseModel):
    min: Optional[datetime] = None
    max: Optional[datetime] = None


class ChartMeasurements(BaseModel):
    lines: dict[str, ChartLine] = {}
    metrics: dict[int, MinMaxValue] = {}
    timestamp: MinMaxDateTime = Field(default_factory=lambda: MinMaxDateTime())


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
    ) -> list[Measurement]:
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
            where.append(f"tags @> {to_array_value(tags)}")
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

            rows.append(Measurement.parse_obj(_row))

        return rows

    async def get_latest_measurements(
        self,
        device_id: Optional[Union[int, list[int]]] = None,
        metric_id: Optional[Union[int, list[int]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> list[Measurement]:
        where = []

        if device_id is not None:
            where.append(f"device_id IN {to_array_filter(device_id)}")
        if metric_id is not None:
            where.append(f"metric_id IN {to_array_filter(metric_id)}")
        if location_id is not None:
            where.append(f"location_id IN {to_array_filter(location_id)}")
        if tags is not None:
            where.append(f"tags @> {to_array_value(tags)}")

        response = await self.connection.fetch(
            GET_LATEST_MEASUREMENTS.format(
                where=" AND ".join(where) if where else "TRUE"
            )
        )

        rows: list[Measurement] = []

        for row in response:
            _row = dict(row)
            _row["value"] = _row.get(f"{row['value_type']}_value")
            rows.append(Measurement.parse_obj(_row))

        return rows

    @staticmethod
    def create_chart_line_key(
        location_id: int,
        metric_id: int,
        tags: list[str],
        device_id: int,
    ) -> str:
        return f"{location_id}:{metric_id}:{','.join(sorted(tags))}:{device_id}"

    async def chart_measurements(
        self,
        device_id: Optional[Union[int, list[int]]] = None,
        metric_id: Optional[Union[int, list[int]]] = None,
        location_id: Optional[Union[int, list[int]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
        timestamp_gte: Optional[datetime] = None,
        timestamp_lte: Optional[datetime] = None,
        point_count: Optional[int] = None,
    ) -> ChartMeasurements:
        chart = ChartMeasurements()
        measurements: list[Measurement] = sorted(
            await self.get_measurements(
                metric_id=metric_id,
                device_id=device_id,
                location_id=location_id,
                tags=tags,
                timestamp_gte=timestamp_gte,
                timestamp_lte=timestamp_lte,
            ),
            key=lambda m: m.timestamp,
        )

        for index, measurement in enumerate(measurements):
            if not isinstance(measurement.value, (int, float, Decimal)):
                continue

            sortedTags = sorted(measurement.tags)
            key = MeasurementsStore.create_chart_line_key(
                location_id=measurement.location_id,
                metric_id=measurement.metric_id,
                tags=sortedTags,
                device_id=measurement.device_id,
            )
            if chart.lines.get(key) is None:
                chart.lines[key] = ChartLine(
                    index=index,
                    location_id=measurement.location_id,
                    metric_id=measurement.metric_id,
                    tags=sortedTags,
                    device_id=measurement.device_id,
                )
            if chart.metrics.get(measurement.metric_id) is None:
                chart.metrics[measurement.metric_id] = MinMaxValue()

            chart.lines[key].points.append(measurement)
            if chart.lines[key].min is None or chart.lines[key].min > measurement.value:
                chart.lines[key].min = measurement.value
            if chart.lines[key].max is None or chart.lines[key].max < measurement.value:
                chart.lines[key].max = measurement.value
            if (
                chart.lines[key].timestamp_min is None
                or chart.lines[key].timestamp_min > measurement.timestamp
            ):
                chart.lines[key].timestamp_min = measurement.timestamp
            if (
                chart.lines[key].timestamp_max is None
                or chart.lines[key].timestamp_max < measurement.timestamp
            ):
                chart.lines[key].timestamp_max = measurement.timestamp
            if (
                chart.metrics[measurement.metric_id].min is None
                or chart.metrics[measurement.metric_id].min > measurement.value
            ):
                chart.metrics[measurement.metric_id].min = measurement.value
            if (
                chart.metrics[measurement.metric_id].max is None
                or chart.metrics[measurement.metric_id].max < measurement.value
            ):
                chart.metrics[measurement.metric_id].max = measurement.value
            if (
                chart.timestamp.min is None
                or measurement.timestamp < chart.timestamp.min
            ):
                chart.timestamp.min = measurement.timestamp
            if (
                chart.timestamp.max is None
                or measurement.timestamp > chart.timestamp.max
            ):
                chart.timestamp.max = measurement.timestamp

        if point_count is not None:
            for key, line in chart.lines.items():
                if line.timestamp_max is None or line.timestamp_min is None:
                    continue

                dt = (line.timestamp_max - line.timestamp_min) / (point_count - 1)
                new_points: list[ChartLinePoint] = []
                point_buffer: list[ChartLinePoint] = []
                time_index = 0

                for point in line.points:
                    if point.timestamp < line.timestamp_min + (time_index + 0.5) * dt:
                        point_buffer.append(point)
                        continue

                    while (
                        point.timestamp >= line.timestamp_min + (time_index + 0.5) * dt
                    ):
                        average: Decimal = Decimal(0)

                        for buffer_point_index, buffer_point in enumerate(point_buffer):
                            next_timestamp = (
                                point_buffer[buffer_point_index + 1].timestamp
                                if buffer_point_index < len(point_buffer) - 1
                                else line.timestamp_min + (time_index + 0.5) * dt
                            )
                            average += Decimal(buffer_point.value) * Decimal(
                                (
                                    next_timestamp - buffer_point.timestamp
                                ).total_seconds()
                            )

                        total_seconds = (
                            dt.total_seconds() if time_index else dt.total_seconds() / 2
                        )
                        new_points.append(
                            ChartLinePoint(
                                timestamp=line.timestamp_min + time_index * dt,
                                value=average / Decimal(total_seconds),
                            ),
                        )

                        point_buffer = [
                            ChartLinePoint(
                                timestamp=line.timestamp_min + (time_index + 0.5) * dt,
                                value=point_buffer[-1].value,
                            )
                        ]

                        time_index += 1

                    point_buffer.append(point)

                chart.lines[key].points = new_points
        return chart

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
                tags=to_array_value(measurement.tags),
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
            serialise_json(
                {
                    "action": "CREATE",
                    "resource": "measurement",
                    "measurement": response,
                }
            ),
        )

        return response
