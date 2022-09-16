import click

from configs import apply_config_variables
from variables import frontend_infrastructure_folder
from infrastructure.nginx import build as build_nginx_common


@click.group()
def frontend() -> None:
    pass


@frontend.command()
def build_docker_compose() -> None:
    apply_config_variables(
        input_path=frontend_infrastructure_folder / "docker-compose.template.yml",
        output_path=frontend_infrastructure_folder / "docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | frontend file built.")


@frontend.command()
def build_nginx() -> None:
    apply_config_variables(
        input_path=frontend_infrastructure_folder / "nginx/frontend.template",
        output_path=frontend_infrastructure_folder / "nginx/frontend.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | frontend file built.")


@frontend.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_docker_compose.invoke(ctx=ctx)
    build_nginx_common.invoke(ctx=ctx)
    build_nginx.invoke(ctx=ctx)
