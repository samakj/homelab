from pathlib import Path
import click
import json
from typing import Any, Optional, Union

from utils import load_json_file, flattern_dict
from variables import (
    containers_config_path,
    hosts_config_path,
    location_config_path,
    ports_config_path,
    subdomains_config_path,
    wifi_config_path,
    nginx_folder,
    docker_compose_folder,
    flat_folders_config,
    postgres_config_path,
)


# Cached configs to ensure we dont waste time re-reading files
containers_config: Optional[dict[str, Any]] = None
hosts_config: Optional[dict[str, Any]] = None
location_config: Optional[dict[str, Any]] = None
ports_config: Optional[dict[str, Any]] = None
postgres_config: Optional[dict[str, Any]] = None
subdomains_config: Optional[dict[str, Any]] = None
wifi_config: Optional[dict[str, Any]] = None


def get_containers_config() -> dict[str, Any]:
    global containers_config
    if containers_config is None:
        containers_config = load_json_file(path=containers_config_path)
    return containers_config


def get_hosts_config() -> dict[str, Any]:
    global hosts_config
    if hosts_config is None:
        hosts_config = load_json_file(path=hosts_config_path)
    return hosts_config


def get_location_config() -> dict[str, Any]:
    global location_config
    if location_config is None:
        location_config = load_json_file(path=location_config_path)
    return location_config


def get_ports_config() -> dict[str, Any]:
    global ports_config
    if ports_config is None:
        ports_config = load_json_file(path=ports_config_path)
    return ports_config


def get_postgres_config() -> dict[str, Any]:
    global postgres_config
    if postgres_config is None:
        postgres_config = load_json_file(path=postgres_config_path)
    return postgres_config


def get_subdomains_config() -> dict[str, Any]:
    global subdomains_config
    if subdomains_config is None:
        subdomains_config = load_json_file(path=subdomains_config_path)
    return subdomains_config


def get_wifi_config() -> dict[str, Any]:
    global wifi_config
    if wifi_config is None:
        wifi_config = load_json_file(path=wifi_config_path)
    return wifi_config


def apply_config_variables(
    input_path: Union[Path, str],
    output_path: Union[Path, str],
    template_prefix: str = "",
    template_suffix: str = "",
) -> None:
    flat_containers_config = flattern_dict(
        obj=get_containers_config(), prefix="containers"
    )
    flat_hosts_config = flattern_dict(obj=get_hosts_config(), prefix="hosts")
    flat_location_config = flattern_dict(obj=get_location_config(), prefix="location")
    flat_ports_config = flattern_dict(obj=get_ports_config(), prefix="ports")
    flat_postgres_config = flattern_dict(obj=get_postgres_config(), prefix="postgres")
    flat_subdomains_config = flattern_dict(
        obj=get_subdomains_config(), prefix="subdomains"
    )
    flat_wifi_config = flattern_dict(obj=get_wifi_config(), prefix="wifi")

    output_text = ""
    with open(file=input_path, mode="r") as input_file:
        output_text = input_file.read()

    for key, value in flat_folders_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_containers_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_hosts_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_location_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_ports_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_postgres_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_subdomains_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )
    for key, value in flat_wifi_config.items():
        output_text = output_text.replace(
            f"{template_prefix}{key}{template_suffix}", str(value)
        )

    with open(file=output_path, mode="w") as output_file:
        output_file.write(output_text)


@click.group()
def configs() -> None:
    pass


@configs.command()
def print_containers() -> None:
    print(
        json.dumps(
            flattern_dict(obj=get_containers_config(), prefix="containers"), indent=4
        )
    )


@configs.command()
def print_hosts() -> None:
    print(json.dumps(flattern_dict(obj=get_hosts_config(), prefix="hosts"), indent=4))


@configs.command()
def print_location() -> None:
    print(
        json.dumps(
            flattern_dict(obj=get_location_config(), prefix="location"), indent=4
        )
    )


@configs.command()
def print_ports() -> None:
    print(json.dumps(flattern_dict(obj=get_ports_config(), prefix="ports"), indent=4))


@configs.command()
def print_postgres() -> None:
    print(
        json.dumps(
            flattern_dict(obj=get_postgres_config(), prefix="postgres"), indent=4
        )
    )


@configs.command()
def print_subdomains() -> None:
    print(
        json.dumps(
            flattern_dict(obj=get_subdomains_config(), prefix="subdomains"), indent=4
        )
    )


@configs.command()
def print_wifi() -> None:
    print(json.dumps(flattern_dict(obj=get_wifi_config(), prefix="wifi"), indent=4))


@configs.command()
@click.pass_context
def print_all(ctx: click.Context) -> None:
    print("Containers")
    print_containers.invoke(ctx=ctx)
    print("")

    print("Hosts")
    print_hosts.invoke(ctx=ctx)
    print("")

    print("Location")
    print_location.invoke(ctx=ctx)
    print("")

    print("Ports")
    print_ports.invoke(ctx=ctx)
    print("")

    print("Postgres")
    print_postgres.invoke(ctx=ctx)
    print("")

    print("Subdomains")
    print_subdomains.invoke(ctx=ctx)
    print("")

    print("Wifi")
    print_wifi.invoke(ctx=ctx)
    print("")


@configs.command()
def build_nginx_devices_scraper_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/devices_scraper.template",
        output_path=nginx_folder / "scrapers/devices_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_frontend_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "frontend.template",
        output_path=nginx_folder / "frontend.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_http_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "http.template",
        output_path=nginx_folder / "http.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_https_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "https.template",
        output_path=nginx_folder / "https.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_iot_api_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "services/iot_api.template",
        output_path=nginx_folder / "services/iot_api.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_portainer_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "portainer.template",
        output_path=nginx_folder / "portainer.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_services_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "services.template",
        output_path=nginx_folder / "services.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_utilities_api_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "services/utilities_api.template",
        output_path=nginx_folder / "services/utilities_api.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_utilities_scraper_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/utilities_scraper.template",
        output_path=nginx_folder / "scrapers/utilities_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_weather_api_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "services/weather_api.template",
        output_path=nginx_folder / "services/weather_api.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_nginx_weather_scraper_conf() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/weather_scraper.template",
        output_path=nginx_folder / "scrapers/weather_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
@click.pass_context
def build_nginx_conf(ctx: click.Context) -> None:
    build_nginx_devices_scraper_conf.invoke(ctx=ctx)
    build_nginx_frontend_conf.invoke(ctx=ctx)
    build_nginx_http_conf.invoke(ctx=ctx)
    build_nginx_https_conf.invoke(ctx=ctx)
    build_nginx_iot_api_conf.invoke(ctx=ctx)
    build_nginx_portainer_conf.invoke(ctx=ctx)
    build_nginx_services_conf.invoke(ctx=ctx)
    build_nginx_utilities_api_conf.invoke(ctx=ctx)
    build_nginx_utilities_scraper_conf.invoke(ctx=ctx)
    build_nginx_weather_api_conf.invoke(ctx=ctx)
    build_nginx_weather_scraper_conf.invoke(ctx=ctx)


@configs.command()
def build_frontend_docker_compose() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "frontend/docker-compose.template.yml",
        output_path=docker_compose_folder / "frontend/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_scrapers_docker_compose() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "scrapers/docker-compose.template.yml",
        output_path=docker_compose_folder / "scrapers/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
def build_services_docker_compose() -> None:
    apply_config_variables(
        input_path=docker_compose_folder / "services/docker-compose.template.yml",
        output_path=docker_compose_folder / "services/docker-compose.yml",
        template_prefix="${",
        template_suffix="}",
    )


@configs.command()
@click.pass_context
def build_docker_compose_files(ctx: click.Context) -> None:
    build_frontend_docker_compose.invoke(ctx=ctx)
    build_scrapers_docker_compose.invoke(ctx=ctx)
    build_services_docker_compose.invoke(ctx=ctx)


@configs.command()
@click.pass_context
def build_conf(ctx: click.Context) -> None:
    build_nginx_conf(ctx=ctx)
    build_docker_compose_files(ctx=ctx)
