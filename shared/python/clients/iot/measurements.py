from typing import Optional, Union
from fastapi import Depends
from datetime import datetime
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.measurement import Measurement, ValueType, ValueTypeOptions


class MeasurementsClient:
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

    async def get_measurement(self, id: int) -> Measurement:
        response = await self.client.get(f"{self.base_url}/v0/measurements/{id}")
        data = response.json()
        return Measurement.parse_obj(data)

    async def get_measurements(
        self,
        id: Optional[Union[int, list[int]]] = None,
        device_id: Optional[Union[str, list[str]]] = None,
        location_id: Optional[Union[str, list[str]]] = None,
        metric_id: Optional[Union[str, list[str]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
        timestamp_gte: Optional[datetime] = None,
        timestamp_lte: Optional[datetime] = None,
        value: Optional[Union[ValueType, list[ValueType]]] = None,
        value_gte: Optional[Union[ValueType, list[ValueType]]] = None,
        value_lte: Optional[Union[ValueType, list[ValueType]]] = None,
    ) -> list[Measurement]:
        response = await self.client.get(
            f"{self.base_url}/v0/measurements",
            params={
                "id": id,
                "device_id": device_id,
                "location_id": location_id,
                "metric_id": metric_id,
                "tags": tags,
                "timestamp_gte": timestamp_gte,
                "timestamp_lte": timestamp_lte,
                "value": value,
                "value_gte": value_gte,
                "value_lte": value_lte,
            },
        )
        data = response.json()
        return [Measurement.parse_obj(measurement) for measurement in data]

    async def get_latest_measurements(
        self,
        id: Optional[Union[int, list[int]]] = None,
        device_id: Optional[Union[str, list[str]]] = None,
        location_id: Optional[Union[str, list[str]]] = None,
        metric_id: Optional[Union[str, list[str]]] = None,
        tags: Optional[Union[str, list[str]]] = None,
    ) -> list[Measurement]:
        response = await self.client.get(
            f"{self.base_url}/v0/measurements/latest",
            params={
                "id": id,
                "device_id": device_id,
                "location_id": location_id,
                "metric_id": metric_id,
                "tags": tags,
            },
        )
        data = response.json()
        return [Measurement.parse_obj(measurement) for measurement in data]

    async def create_measurement(
        self,
        timestamp: datetime,
        device_id: int,
        location_id: int,
        metric_id: int,
        value_type: ValueTypeOptions,
        value: Optional[ValueType] = None,
        tags: list[str] = [],
    ) -> Measurement:
        response = await self.client.post(
            f"{self.base_url}/v0/measurements",
            data={
                "timestamp": timestamp,
                "device_id": device_id,
                "location_id": location_id,
                "metric_id": metric_id,
                "value_type": value_type,
                "value": value,
                "tags": tags,
            },
        )
        data = response.json()
        return Measurement.parse_obj(data)
