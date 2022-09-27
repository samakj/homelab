from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
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

    def __init__(
        self,
        http_connection: HTTPConnection,
        client: AsyncInternalRequestClient = Depends(AsyncInternalRequestClient()),
    ) -> None:
        self.client = client

        self.base_url = http_connection.app.config.get("urls", {}).get("iot_api")
        if self.base_url is None:
            raise ValueError("config.urls.iot_api not set.")

        self.devices = DevicesClient(http_connection=http_connection, client=client)
        self.locations = LocationsClient(http_connection=http_connection, client=client)
        self.measurements = MeasurementsClient(
            http_connection=http_connection, client=client
        )
        self.metrics = MetricsClient(http_connection=http_connection, client=client)

    async def meta(self) -> MetaResponse:
        response = await self.client.get(f"{self.base_url}/v0/meta")
        data = response.json()
        return MetaResponse.parse_obj(data)

    async def ping(self) -> PingResponse:
        response = await self.client.get(f"{self.base_url}/v0/ping")
        data = response.json()
        return PingResponse.parse_obj(data)
