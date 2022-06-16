import click
import json
from typing import Any, Optional

from utils import load_json_file, flattern_dict
from variables import (
    hosts_config_path,
    location_config_path,
    ports_config_path,
    wifi_config_path,
)


# Cached configs to ensure we dont waste time re-reading files
hosts_config: Optional[dict[str, Any]] = None
location_config: Optional[dict[str, Any]] = None
ports_config: Optional[dict[str, Any]] = None
wifi_config: Optional[dict[str, Any]] = None


def get_hosts_config() -> dict[str, Any]:
    global hosts_config
    if hosts_config is None:
        hosts_config = load_json_file(hosts_config_path)
    return hosts_config


def get_location_config() -> dict[str, Any]:
    global location_config
    if location_config is None:
        location_config = load_json_file(location_config_path)
    return location_config


def get_ports_config() -> dict[str, Any]:
    global ports_config
    if ports_config is None:
        ports_config = load_json_file(ports_config_path)
    return ports_config


def get_wifi_config() -> dict[str, Any]:
    global wifi_config
    if wifi_config is None:
        wifi_config = load_json_file(wifi_config_path)
    return wifi_config


@click.group()
def configs() -> None:
    pass


@configs.command()
def print_hosts() -> None:
    print(json.dumps(flattern_dict(get_hosts_config(), "host"), indent=4))


@configs.command()
def print_location() -> None:
    print(json.dumps(flattern_dict(get_location_config(), "location"), indent=4))


@configs.command()
def print_ports() -> None:
    print(json.dumps(flattern_dict(get_ports_config(), "port"), indent=4))


@configs.command()
def print_wifi() -> None:
    print(json.dumps(flattern_dict(get_wifi_config(), "wifi"), indent=4))


@configs.command()
@click.pass_context
def print_all(ctx: click.Context) -> None:
    print("Hosts")
    print_hosts.invoke(ctx)
    print("")

    print("Location")
    print_location.invoke(ctx)
    print("")

    print("Ports")
    print_ports.invoke(ctx)
    print("")

    print("Wifi")
    print_wifi.invoke(ctx)
    print("")
