from config import config

from shared.python.extensions.speedyapi.cache import Cache

cache = Cache(
    host=config["cache"]["host"],
    port=config["cache"]["port"],
)
