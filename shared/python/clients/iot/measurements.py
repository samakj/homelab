from typing import Optional, Union
from fastapi import Depends
from datetime import datetime
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.measurement import Measurement, ValueType, ValueTypeOptions
from shared.python.json import to_json_serialisable


class MeasurementsClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "MeasurementsClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return MeasurementsClient(base_url=base_url, http_client=client)

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

    async def get_measurement(self, id: int) -> Measurement:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/measurements/{id}")
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
        params = {}

        if id is not None:
            params["id"] = id
        if device_id is not None:
            params["device_id"] = device_id
        if location_id is not None:
            params["location_id"] = location_id
        if metric_id is not None:
            params["metric_id"] = metric_id
        if tags is not None:
            params["tags"] = tags
        if timestamp_gte is not None:
            params["timestamp_gte"] = timestamp_gte.isoformat()
        if timestamp_lte is not None:
            params["timestamp_lte"] = timestamp_lte.isoformat()
        if value is not None:
            params["value"] = value
        if value_gte is not None:
            params["value_gte"] = value_gte
        if value_lte is not None:
            params["value_lte"] = value_lte

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/measurements",
                params=params,
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
        params = {}

        if id is not None:
            params["id"] = id
        if device_id is not None:
            params["device_id"] = device_id
        if location_id is not None:
            params["location_id"] = location_id
        if metric_id is not None:
            params["metric_id"] = metric_id
        if tags is not None:
            params["tags"] = tags

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/measurements/latest",
                params=params,
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
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/measurements",
                json=to_json_serialisable(
                    {
                        "timestamp": timestamp,
                        "device_id": device_id,
                        "location_id": location_id,
                        "metric_id": metric_id,
                        "value_type": value_type,
                        "value": value,
                        "tags": tags,
                    }
                ),
            )
            data = response.json()
            return Measurement.parse_obj(data)
