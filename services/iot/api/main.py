from pathlib import Path

from routes.devices import DEVICES_V0_ROUTER
from routes.locations import LOCATIONS_V0_ROUTER
from routes.measurements import MEASUREMENTS_V0_ROUTER
from routes.metrics import METRICS_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.extensions.speedyapi.database import Database
from shared.python.helpers.load_json_file import load_json_file

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")

app.db = Database(
    host=app.config["db"]["host"],
    port=app.config["db"]["port"],
    user=app.config["db"]["user"],
    password=app.config["db"]["password"],
    name=app.config["db"]["name"],
)

app.include_router(DEVICES_V0_ROUTER)
app.include_router(LOCATIONS_V0_ROUTER)
app.include_router(MEASUREMENTS_V0_ROUTER)
app.include_router(METRICS_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    await app.db.initialise()
