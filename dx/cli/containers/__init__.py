import click

from containers.docker_compose import docker_compose
from containers.nginx import nginx


@click.group()
def containers() -> None:
    pass


containers.add_command(cmd=docker_compose)
containers.add_command(cmd=nginx)
