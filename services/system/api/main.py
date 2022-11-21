from cache import cache
from config import config
from routes.cpu import CPU_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI


app = SpeedyAPI()
app.config = config

app.cache = cache

app.include_router(CPU_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    app.cache.logger = app.logger
    await app.cache.initialise()
