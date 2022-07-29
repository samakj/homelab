import click

from services.authorisation import authorisation_api
from services.iot import iot_api
from services.gps import gps_api
from services.postgres import postgres
from services.redis import redis
from services.utilities import utilities_api
from services.weather import weather_api


@click.group()
def services() -> None:
    pass


services.add_command(cmd=authorisation_api)
services.add_command(cmd=iot_api)
services.add_command(cmd=gps_api)
services.add_command(cmd=postgres)
services.add_command(cmd=redis)
services.add_command(cmd=utilities_api)
services.add_command(cmd=weather_api)
