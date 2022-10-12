from passlib.context import CryptContext

from cache import cache
from config import config
from database import database
from routes.login import LOGIN_V0_ROUTER
from routes.sessions import SESSIONS_V0_ROUTER
from routes.users import USERS_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI


app = SpeedyAPI()
app.config = config
app.password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.db = database
app.cache = cache

app.include_router(LOGIN_V0_ROUTER)
app.include_router(SESSIONS_V0_ROUTER)
app.include_router(USERS_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    app.db.logger = app.logger
    app.cache.logger = app.logger
    await app.db.initialise()
    await app.cache.initialise()
