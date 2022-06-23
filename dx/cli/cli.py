import click
from configs import configs
from containers import containers
from services import services


@click.group()
def cli() -> None:
    pass


cli.add_command(cmd=configs)
cli.add_command(cmd=services)
cli.add_command(cmd=containers)
