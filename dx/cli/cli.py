import click
from configs import configs
from infrastructure import infrastructure
from devices import devices

# from hosts import hosts
from services import services
from shared import shared


@click.group()
def cli() -> None:
    pass


cli.add_command(cmd=configs)
cli.add_command(cmd=infrastructure)
cli.add_command(cmd=devices)
# cli.add_command(cmd=hosts)
cli.add_command(cmd=services)
cli.add_command(cmd=shared)
