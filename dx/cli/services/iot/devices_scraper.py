import click
import os

from configs import get_hosts_config, get_ports_config, apply_config_variables
from variables import iot_service_folder, shared_folder


@click.group()
def devices_scraper() -> None:
    pass


@devices_scraper.command()
def build() -> None:
    apply_config_variables(
        input_path=iot_service_folder / "devices-scraper/config.template.json",
        output_path=iot_service_folder / "devices-scraper/config.json",
        template_prefix="${",
        template_suffix="}",
    )


@devices_scraper.command()
def freeze_requirements() -> None:
    os.chdir(iot_service_folder / "devices-scraper")
    os.system(
        """
python3 -m venv .;
. bin/activate;
pip install -r requirements-to-freeze.txt;
pip freeze > requirements.txt;
deactivate;
        """
    )


@devices_scraper.command()
def start_venv_app() -> None:
    host = get_hosts_config()["scrapers"]
    port = get_ports_config()["iot_devices_scraper"]

    os.chdir(iot_service_folder / "devices-scraper")
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
