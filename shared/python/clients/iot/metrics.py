from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.metric import Metric


class MetricsClient:
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

    async def get_metric(self, id: int) -> Metric:
        response = await self.client.get(f"{self.base_url}/v0/metrics/{id}")
        data = response.json()
        return Metric.parse_obj(data)

    async def get_metric_by_name(self, name: str) -> Metric:
        response = await self.client.get(f"{self.base_url}/v0/metrics/{name}")
        data = response.json()
        return Metric.parse_obj(data)

    async def get_metrics(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        abbreviation: Optional[Union[str, list[str]]] = None,
        unit: Optional[Union[str, list[str]]] = None,
    ) -> list[Metric]:
        response = await self.client.get(
            f"{self.base_url}/v0/metrics",
            params={
                "id": id,
                "name": name,
                "abbreviation": abbreviation,
                "unit": unit,
            },
        )
        data = response.json()
        return [Metric.parse_obj(metric) for metric in data]

    async def create_metric(
        self,
        name: str,
        abbreviation: str,
        unit: Optional[str] = None,
    ) -> Metric:
        response = await self.client.post(
            f"{self.base_url}/v0/metrics",
            data={
                "name": name,
                "abbreviation": abbreviation,
                "unit": unit,
            },
        )
        data = response.json()
        return Metric.parse_obj(data)

    async def update_metric(
        self,
        metric: Metric,
    ) -> Metric:
        response = await self.client.patch(
            f"{self.base_url}/v0/metrics/{metric.id}",
            data=dict(metric),
        )
        data = response.json()
        return Metric.parse_obj(data)

    async def delete_metric(
        self,
        id: int,
    ) -> Metric:
        await self.client.delete(f"{self.base_url}/v0/metrics/{id}")
        return None
