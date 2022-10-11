import os
import click


@click.group()
def docker() -> None:
    pass


@docker.command()
def create_external_network() -> None:
    os.system(
        """
docker network inspect external >/dev/null 2>&1 || \
docker network create --driver bridge external 
        """
    )
    print("Docker Compose | apis file built.")
