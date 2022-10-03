from config import config

from shared.python.extensions.speedyapi.database import Database

database = Database(
    host=config["db"]["host"],
    port=config["db"]["port"],
    user=config["db"]["user"],
    password=config["db"]["password"],
    name=config["db"]["name"],
)
