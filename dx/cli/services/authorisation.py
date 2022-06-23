import click
import os

from configs import get_hosts_config, get_ports_config
from variables import authorisation_service_folder, shared_folder


@click.group()
def authorisation_api() -> None:
    pass


@authorisation_api.command()
def freeze_requirements() -> None:
    os.chdir(authorisation_service_folder / "api")
    os.system("python3 -m venv .")
    os.system(". bin/activate")
    os.system("pip install -r requirements-to-freeze.txt")
    os.system("pip freeze > requirements.txt")
    os.system("deactivate")


@authorisation_api.command()
def start_venv_app() -> None:
    host = get_hosts_config()["apis"]
    port = get_ports_config()["authorisation_api"]

    os.chdir(authorisation_service_folder / "api")
    os.system("python3 -m venv .")
    os.system(". bin/activate")
    os.system(f"cp -r {shared_folder} ./")
    os.system("pip install -r requirements.txt")
    os.system(f"uvicorn main:app --reload --host={host} --port={port}")
    os.system("deactivate")
