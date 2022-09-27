from pathlib import Path

from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.extensions.speedyapi.websockets import WebsocketsStore
from shared.python.helpers.load_json_file import load_json_file

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")

app.websockets = WebsocketsStore()


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    pass


@app.on_event("shutdown")  # type: ignore
async def shutdown() -> None:
    pass
