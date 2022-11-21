import os
from pathlib import Path
from typing import Any

file = Path(os.path.abspath(__file__))
root_folder = file.parent.parent.parent

# Infrastructure
infrastructure_folder = root_folder / "infrastructure"
apis_infrastructure_folder = infrastructure_folder / "apis"
apollo_infrastructure_folder = infrastructure_folder / "apollo"
frontend_infrastructure_folder = infrastructure_folder / "frontend"
scrapers_infrastructure_folder = infrastructure_folder / "scrapers"
nginx_folder = infrastructure_folder / "nginx"

# Config
config_folder = root_folder / "config"
auth_config_path = config_folder / "auth.config.json"
containers_config_path = config_folder / "containers.config.json"
devices_config_path = config_folder / "devices.config.json"
hosts_config_path = config_folder / "hosts.config.json"
location_config_path = config_folder / "location.config.json"
ntp_config_path = config_folder / "ntp.config.json"
passwords_config_path = config_folder / "passwords.config.json"
ports_config_path = config_folder / "ports.config.json"
postgres_config_path = config_folder / "postgres.config.json"
subdomains_config_path = config_folder / "subdomains.config.json"
wifi_config_path = config_folder / "wifi.config.json"

#  Devcies
devices_folder = root_folder / "devices"
conservatory_folder = devices_folder / "conservatory"
hot_water_tank_folder = devices_folder / "hot-water-tank"
living_room_folder = devices_folder / "living-room"
sandbox_folder = devices_folder / "sandbox"
sheps_lobby_folder = devices_folder / "sheps-lobby"
device_ui_folder = devices_folder / "ui"

#  DX
dx_folder = root_folder / "dx"
cli_folder = dx_folder / "cli"

#  Services
services_folder = root_folder / "services"
authorisation_service_folder = services_folder / "authorisation"
chrony_service_folder = services_folder / "chrony"
frontend_service_folder = services_folder / "frontend"
gps_service_folder = services_folder / "gps"
gpsd_service_folder = services_folder / "gpsd"
iot_service_folder = services_folder / "iot"
postgres_service_folder = services_folder / "postgres"
redis_service_folder = services_folder / "redis"
utilities_service_folder = services_folder / "utilities"
weather_service_folder = services_folder / "weather"
system_service_folder = services_folder / "system"

# Shared
shared_folder = root_folder / "shared"
shared_python_folder = shared_folder / "python"
shared_cpp_folder = shared_folder / "c++"


# Map


def generate_flat_folders_config() -> dict[str, Any]:
    flat_config = {}

    for path, _, __ in os.walk(root_folder):
        should_ignore = False
        for ignore in [
            ".git",
            ".vscode",
            "__pycache__",
            ".mypy_cache",
            "lib",
            "bin",
        ]:
            if ignore in path:
                should_ignore = True
                break
        if should_ignore:
            continue
        flat_config[
            f"folders{path.replace(str(root_folder), '').replace('-', '_').replace('/', '.')}"
        ] = path

    return flat_config


flat_folders_config = generate_flat_folders_config()
