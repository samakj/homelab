import os
from pathlib import Path
from typing import Any

file = Path(os.path.abspath(__file__))
root_folder = file.parent.parent.parent

# Containers
container_folder = root_folder / "containers"
nginx_folder = container_folder / "nginx"
docker_compose_folder = container_folder / "docker-compose"

# Config
config_folder = root_folder / "config"
containers_config_path = config_folder / "containers.config.json"
hosts_config_path = config_folder / "hosts.config.json"
location_config_path = config_folder / "location.config.json"
ports_config_path = config_folder / "ports.config.json"
postgres_config_path = config_folder / "postgres.config.json"
subdomains_config_path = config_folder / "subdomains.config.json"
wifi_config_path = config_folder / "wifi.config.json"

#  DX
dx_folder = root_folder / "dx"
cli_folder = dx_folder / "cli"

# Map


def generate_flat_folders_config() -> dict[str, Any]:
    flat_config = {}

    for path, _, __ in os.walk(root_folder):
        should_ignore = False
        for ignore in [".git", ".vscode", "__pycache__", ".mypy_cache"]:
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
