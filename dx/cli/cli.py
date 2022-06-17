import click
from configs import configs


@click.group()
def cli() -> None:
    pass


cli.add_command(cmd=configs)
