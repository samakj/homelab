import click
import os

from configs import get_hosts_config, get_ports_config, apply_config_variables
from variables import utilities_service_folder, shared_folder


@click.group()
def utilities_api() -> None:
    pass


@utilities_api.command()
def build_config() -> None:
    apply_config_variables(
        input_path=utilities_service_folder / "api/config.template.json",
        output_path=utilities_service_folder / "api/config.json",
        template_prefix="${",
        template_suffix="}",
    )


@utilities_api.command()
def freeze_requirements() -> None:
    os.chdir(utilities_service_folder / "api")
    os.system(
        """
python3 -m venv .;
. bin/activate;
pip install -r requirements-to-freeze.txt;
pip freeze > requirements.txt;
deactivate;
        """
    )


@utilities_api.command()
def start_venv_app() -> None:
    host = get_hosts_config()["apis"]
    port = get_ports_config()["utilities_api"]

    os.chdir(utilities_service_folder / "api")
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
