import click

from .api import api, build as build_api
from .devices_scraper import devices_scraper, build as build_devices_scraper


@click.group()
def iot() -> None:
    pass


iot.add_command(cmd=api)
iot.add_command(cmd=devices_scraper)


@iot.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_api.invoke(ctx=ctx)
    build_devices_scraper.invoke(ctx=ctx)
