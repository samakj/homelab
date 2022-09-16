import click
import os

from configs import get_hosts_config, get_ports_config, apply_config_variables
from variables import weather_service_folder, shared_folder


@click.group()
def weather_api() -> None:
    pass


@weather_api.command()
def build() -> None:
    apply_config_variables(
        input_path=weather_service_folder / "api/config.template.json",
        output_path=weather_service_folder / "api/config.json",
        template_prefix="${",
        template_suffix="}",
    )


@weather_api.command()
def freeze_requirements() -> None:
    os.chdir(weather_service_folder / "api")
    os.system(
        """
python3 -m venv .;
. bin/activate;
pip install -r requirements-to-freeze.txt;
pip freeze > requirements.txt;
deactivate;
        """
    )


@weather_api.command()
def start_venv_app() -> None:
    host = get_hosts_config()["apis"]
    port = get_ports_config()["weather_api"]

    os.chdir(weather_service_folder / "api")
    os.system(
        f"""
python3 -m venv .;
. bin/activate;
cp -r {shared_folder} ./;
pip install -r requirements.txt;
uvicorn main:app --reload --host={host} --port={port};
deactivate;
        """
    )
