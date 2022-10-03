from cache import cache
from config import config
from database import database
from routes.devices import DEVICES_V0_ROUTER
from routes.locations import LOCATIONS_V0_ROUTER
from routes.measurements import MEASUREMENTS_V0_ROUTER
from routes.metrics import METRICS_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.extensions.speedyapi.websockets import WebsocketsStore

app = SpeedyAPI()
app.config = config
app.db = database
app.cache = cache
app.websockets = WebsocketsStore()

app.include_router(DEVICES_V0_ROUTER)
app.include_router(LOCATIONS_V0_ROUTER)
app.include_router(MEASUREMENTS_V0_ROUTER)
app.include_router(METRICS_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    app.db.logger = app.logger
    app.cache.logger = app.logger
    await app.db.initialise()
    await app.cache.initialise()


@app.on_event("shutdown")  # type: ignore
async def shutdown() -> None:
    pass
