import click

from configs import apply_config_variables
from variables import docker_compose_folder


@click.group()
def docker_compose() -> None:
    pass


@docker_compose.command()
def build_apis() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "apis/docker-compose.template.yml",
        output_path=docker_compose_folder / "apis/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | apis file built.")


@docker_compose.command()
def build_frontend() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "frontend/docker-compose.template.yml",
        output_path=docker_compose_folder / "frontend/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | frontend file built.")


@docker_compose.command()
def build_scrapers() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "scrapers/docker-compose.template.yml",
        output_path=docker_compose_folder / "scrapers/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | scrapers file built.")


@docker_compose.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_apis.invoke(ctx=ctx)
    build_frontend.invoke(ctx=ctx)
    build_scrapers.invoke(ctx=ctx)
