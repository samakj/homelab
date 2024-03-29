import os
import click

from configs import apply_config_variables
from variables import scrapers_infrastructure_folder
from infrastructure.nginx import build as build_nginx_common
from infrastructure.docker import create_external_network
from services.iot.devices_scraper import build as build_devices_scraper


@click.group()
def scrapers() -> None:
    pass


@scrapers.command()
def build_docker_compose() -> None:
    apply_config_variables(
        input_path=scrapers_infrastructure_folder / "docker-compose.template.yml",
        output_path=scrapers_infrastructure_folder / "docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )
    print("Docker Compose | scrapers file built.")


@scrapers.command()
def build_nginx() -> None:
    apply_config_variables(
        input_path=scrapers_infrastructure_folder / "nginx/devices_scraper.template",
        output_path=scrapers_infrastructure_folder / "nginx/devices_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | devices_scraper file built.")
    apply_config_variables(
        input_path=scrapers_infrastructure_folder / "nginx/utilities_scraper.template",
        output_path=scrapers_infrastructure_folder / "nginx/utilities_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | utilities_scraper file built.")
    apply_config_variables(
        input_path=scrapers_infrastructure_folder / "nginx/weather_scraper.template",
        output_path=scrapers_infrastructure_folder / "nginx/weather_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | weather_scraper file built.")
    apply_config_variables(
        input_path=scrapers_infrastructure_folder / "nginx/scrapers.template",
        output_path=scrapers_infrastructure_folder / "nginx/scrapers.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | scrapers file built.")


@scrapers.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_docker_compose.invoke(ctx=ctx)
    build_nginx_common.invoke(ctx=ctx)
    build_nginx.invoke(ctx=ctx)
    build_devices_scraper.invoke(ctx=ctx)


@scrapers.command()
@click.pass_context
def start(ctx: click.Context) -> None:
    build.invoke(ctx=ctx)
    create_external_network.invoke(ctx=ctx)
    os.chdir(scrapers_infrastructure_folder)
    os.system(
        """
docker-compose down;
docker-compose build;
docker-compose up;
        """
    )
