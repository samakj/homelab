from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.metric import Metric


class MetricsClient:
    client: AsyncInternalClient
    base_url: str

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "MetricsClient":
        base_url = connection.app.config.get("urls", {}).get("iot_api")
        if base_url is None:
            raise ValueError("config.urls.iot_api not set.")

        return MetricsClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

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
            json={
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
            json=dict(metric),
        )
        data = response.json()
        return Metric.parse_obj(data)

    async def delete_metric(
        self,
        id: int,
    ) -> Metric:
        await self.client.delete(f"{self.base_url}/v0/metrics/{id}")
        return None
