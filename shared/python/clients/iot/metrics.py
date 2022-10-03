from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.metric import Metric
from shared.python.json import to_json_serialisable


class MetricsClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "MetricsClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return MetricsClient(base_url=base_url, http_client=client)

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

    async def get_metric(self, id: int) -> Metric:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/metrics/{id}")
            data = response.json()
            return Metric.parse_obj(data)

    async def get_metric_by_name(self, name: str) -> Metric:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/metrics/{name}")
            data = response.json()
            return Metric.parse_obj(data)

    async def get_metrics(
        self,
        id: Optional[Union[int, list[int]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        abbreviation: Optional[Union[str, list[str]]] = None,
        unit: Optional[Union[str, list[str]]] = None,
    ) -> list[Metric]:
        params = {}

        if id is not None:
            params["id"] = id
        if name is not None:
            params["name"] = name
        if abbreviation is not None:
            params["abbreviation"] = abbreviation
        if unit is not None:
            params["unit"] = unit

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/metrics",
                params=params,
            )
            data = response.json()
            return [Metric.parse_obj(metric) for metric in data]

    async def create_metric(
        self,
        name: str,
        abbreviation: str,
        unit: Optional[str] = None,
    ) -> Metric:
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/metrics",
                json=to_json_serialisable(
                    {
                        "name": name,
                        "abbreviation": abbreviation,
                        "unit": unit,
                    }
                ),
            )
            data = response.json()
            return Metric.parse_obj(data)

    async def update_metric(
        self,
        metric: Metric,
    ) -> Metric:
        async with self.http_client() as http:
            response = await http.patch(
                f"{self.base_url}/v0/metrics/{metric.id}",
                data=metric.json(encoder=to_json_serialisable),
            )
            data = response.json()
            return Metric.parse_obj(data)

    async def delete_metric(
        self,
        id: int,
    ) -> Metric:
        async with self.http_client() as http:
            await http.delete(f"{self.base_url}/v0/metrics/{id}")
            return None
