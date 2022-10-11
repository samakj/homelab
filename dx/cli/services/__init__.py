import click

from services.authorisation import authorisation_api, build as build_authorisation
from services.iot import iot, build as build_iot
from services.gps import gps_api, build as build_gps
from services.postgres import postgres, build as build_postgres
from services.redis import redis, build as build_redis
from services.utilities import utilities_api, build as build_utilities
from services.weather import weather_api, build as build_weather
from services.frontend import frontend, build as build_frontend


@click.group()
def services() -> None:
    pass


services.add_command(cmd=authorisation_api)
services.add_command(cmd=iot)
services.add_command(cmd=frontend)
services.add_command(cmd=gps_api)
services.add_command(cmd=postgres)
services.add_command(cmd=redis)
services.add_command(cmd=utilities_api)
services.add_command(cmd=weather_api)


@services.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_authorisation.invoke(ctx=ctx)
    build_iot.invoke(ctx=ctx)
    build_frontend.invoke(ctx=ctx)
    build_gps.invoke(ctx=ctx)
    build_postgres.invoke(ctx=ctx)
    build_redis.invoke(ctx=ctx)
    build_utilities.invoke(ctx=ctx)
    build_weather.invoke(ctx=ctx)
