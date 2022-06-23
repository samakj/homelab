import click

from services.authorisation import authorisation_api
from services.postgres import postgres
from services.redis import redis


@click.group()
def services() -> None:
    pass


services.add_command(cmd=authorisation_api)
services.add_command(cmd=postgres)
services.add_command(cmd=redis)
