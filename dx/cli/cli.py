import click
from configs import configs
from containers import containers
from devices import devices
from services import services


@click.group()
def cli() -> None:
    pass


cli.add_command(cmd=configs)
cli.add_command(cmd=containers)
cli.add_command(cmd=devices)
cli.add_command(cmd=services)
