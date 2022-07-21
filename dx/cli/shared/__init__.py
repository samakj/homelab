import click

from shared.cpp import cpp


@click.group()
def shared() -> None:
    pass


shared.add_command(cmd=cpp)
