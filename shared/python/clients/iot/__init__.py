from typing import Optional
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.extensions.speedyapi.routes.meta import MetaResponse
from shared.python.extensions.speedyapi.routes.ping import PingResponse
from shared.python.clients.iot.devices import DevicesClient
from shared.python.clients.iot.locations import LocationsClient
from shared.python.clients.iot.measurements import MeasurementsClient
from shared.python.clients.iot.metrics import MetricsClient


class IoTClient:
    client: AsyncInternalClient
    base_url: str
    devices: DevicesClient
    locations: LocationsClient
    measurements: MeasurementsClient
    metrics: MetricsClient

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "IoTClient":
        base_url = connection.app.config.get("urls", {}).get("iot_api")
        if base_url is None:
            raise ValueError("config.urls.iot_api not set.")

        return IoTClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

        self.devices = DevicesClient(base_url=base_url, client=client)
        self.locations = LocationsClient(base_url=base_url, client=client)
        self.measurements = MeasurementsClient(base_url=base_url, client=client)
        self.metrics = MetricsClient(base_url=base_url, client=client)

    async def meta(self) -> MetaResponse:
        response = await self.client.get(f"{self.base_url}/v0/meta")
        data = response.json()
        return MetaResponse.parse_obj(data)

    async def ping(self) -> PingResponse:
        response = await self.client.get(f"{self.base_url}/v0/ping")
        data = response.json()
        return PingResponse.parse_obj(data)
