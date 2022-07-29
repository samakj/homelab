import asyncio
from pathlib import Path

from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.helpers.load_json_file import load_json_file

from gps_watcher import GPSWatcher
from routes.gps import GPS_V0_ROUTER

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")
app.watcher = GPSWatcher(port=1111)

app.include_router(GPS_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    asyncio.create_task(app.watcher.watch())
    pass


@app.on_event("shutdown")  # type: ignore
async def shutdown() -> None:
    pass
