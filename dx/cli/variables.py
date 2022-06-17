import os
from pathlib import Path

file = Path(os.path.abspath(__file__))
root_folder = file.parent.parent.parent

# Containers
container_folder = root_folder / "containers"
nginx_folder = container_folder / "nginx"

# Config
config_folder = root_folder / "config"
containers_config_path = config_folder / "containers.config.json"
hosts_config_path = config_folder / "hosts.config.json"
location_config_path = config_folder / "location.config.json"
ports_config_path = config_folder / "ports.config.json"
subdomains_config_path = config_folder / "subdomains.config.json"
wifi_config_path = config_folder / "wifi.config.json"

#  DX
dx_folder = root_folder / "dx"
cli_folder = dx_folder / "cli"
