import asyncio
from pathlib import Path

from login import login
from routes.watch import WATCH_V0_ROUTER
from socket_updater import socket_updater
from scrapers.measurements import MeasurementScraper
from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.clients.authorisation import AuthorisationClient
from shared.python.clients.iot import IoTClient
from shared.python.extensions.speedyapi.websockets import WebsocketsStore
from shared.python.helpers.load_json_file import load_json_file

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")
app.websockets = WebsocketsStore()
app.authorisation_client = AuthorisationClient(
    base_url=app.config.get("urls", {}).get("authorisation_api")
)
app.iot_client = IoTClient(base_url=app.config.get("urls", {}).get("iot_api"))
app.measurements_scraper = MeasurementScraper(app=app)

app.include_router(WATCH_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    await login(app=app)
    asyncio.create_task(socket_updater(app=app))


@app.on_event("shutdown")  # type: ignore
async def shutdown() -> None:
    await app.measurements_scraper.unwatch_all()
