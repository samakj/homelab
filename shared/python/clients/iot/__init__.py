from typing import Optional
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
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
    http_client: AsyncRequestClient
    base_url: str
    devices: DevicesClient
    locations: LocationsClient
    measurements: MeasurementsClient
    metrics: MetricsClient

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "IoTClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return IoTClient(base_url=base_url, http_client=client)

    def __init__(
        self,
        base_url: str,
        http_client: Optional[AsyncRequestClient] = None,
        access_token: Optional[str] = None,
    ) -> None:
        self.http_client = http_client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

        self.devices = DevicesClient(base_url=base_url, http_client=http_client)
        self.locations = LocationsClient(base_url=base_url, http_client=http_client)
        self.measurements = MeasurementsClient(
            base_url=base_url, http_client=http_client
        )
        self.metrics = MetricsClient(base_url=base_url, http_client=http_client)

    def set_access_token(self, access_token: Optional[str] = None) -> None:
        self.http_client.set_access_token(access_token=access_token)
        self.devices.set_access_token(access_token=access_token)
        self.locations.set_access_token(access_token=access_token)
        self.measurements.set_access_token(access_token=access_token)
        self.metrics.set_access_token(access_token=access_token)

    async def meta(self) -> MetaResponse:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/meta")
            data = response.json()
            return MetaResponse.parse_obj(data)

    async def ping(self) -> PingResponse:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/ping")
            data = response.json()
            return PingResponse.parse_obj(data)
