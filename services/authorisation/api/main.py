from pathlib import Path

from passlib.context import CryptContext

from routes.login import LOGIN_V0_ROUTER
from routes.sessions import SESSIONS_V0_ROUTER
from routes.users import USERS_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.extensions.speedyapi.database import Database
from shared.python.helpers.load_json_file import load_json_file


app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")
app.password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.db = Database(
    host=app.config["db"]["host"],
    port=app.config["db"]["port"],
    user=app.config["db"]["user"],
    password=app.config["db"]["password"],
    name=app.config["db"]["name"],
)

app.include_router(LOGIN_V0_ROUTER)
app.include_router(SESSIONS_V0_ROUTER)
app.include_router(USERS_V0_ROUTER)


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    await app.db.initialise()
