import os
import click

from configs import apply_config_variables
from variables import apis_infrastructure_folder
from infrastructure.nginx import build as build_nginx_common
from infrastructure.docker import create_external_network
from services.authorisation import build as build_authorisation
from services.iot import build as build_iot
from services.utilities import build as build_utilities
from services.weather import build as build_weather


@click.group()
def apis() -> None:
    pass


@apis.command()
def build_docker_compose() -> None:
    apply_config_variables(
        input_path=apis_infrastructure_folder / "docker-compose.template.yml",
        output_path=apis_infrastructure_folder / "docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | apis file built.")


@apis.command()
def build_nginx() -> None:
    apply_config_variables(
        input_path=apis_infrastructure_folder / "nginx/authorisation_api.template",
        output_path=apis_infrastructure_folder / "nginx/authorisation_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | authorisation_api file built.")
    apply_config_variables(
        input_path=apis_infrastructure_folder / "nginx/iot_api.template",
        output_path=apis_infrastructure_folder / "nginx/iot_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | iot_api file built.")
    apply_config_variables(
        input_path=apis_infrastructure_folder / "nginx/utilities_api.template",
        output_path=apis_infrastructure_folder / "nginx/utilities_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | utilities_api file built.")
    apply_config_variables(
        input_path=apis_infrastructure_folder / "nginx/weather_api.template",
        output_path=apis_infrastructure_folder / "nginx/weather_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | weather_api file built.")
    apply_config_variables(
        input_path=apis_infrastructure_folder / "nginx/apis.template",
        output_path=apis_infrastructure_folder / "nginx/apis.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | apis file built.")


@apis.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_docker_compose.invoke(ctx=ctx)
    build_nginx_common.invoke(ctx=ctx)
    build_nginx.invoke(ctx=ctx)
    build_authorisation.invoke(ctx=ctx)
    build_iot.invoke(ctx=ctx)
    build_utilities.invoke(ctx=ctx)
    build_weather.invoke(ctx=ctx)


@apis.command()
@click.pass_context
def start(ctx: click.Context) -> None:
    build.invoke(ctx=ctx)
    create_external_network.invoke(ctx=ctx)
    os.chdir(apis_infrastructure_folder)
    os.system(
        """
docker-compose down;
docker-compose build;
docker-compose up;
        """
    )
