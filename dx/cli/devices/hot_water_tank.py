import click
import os

from variables import hot_water_tank_folder, shared_cpp_folder, device_ui_folder
from configs import apply_config_variables, get_devices_config
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def hot_water_tank() -> None:
    pass


@hot_water_tank.command()
def link_libs() -> None:
    os.system(f"rm -rf {hot_water_tank_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {hot_water_tank_folder / 'lib'}")


@hot_water_tank.command()
def build_config() -> None:
    apply_config_variables(
        input_path=hot_water_tank_folder / "src/config.template.h",
        output_path=hot_water_tank_folder / "src/config.h",
        template_prefix="${",
        template_suffix="}",
    )


@hot_water_tank.command()
def format() -> None:
    os.system(
        f"find {hot_water_tank_folder}/src -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )


@hot_water_tank.command()
def build_ui() -> None:
    config = get_devices_config()["hot_water_tank"]
    os.chdir(device_ui_folder)
    os.system(
        f"HOSTNAME={config['hostname']} IP_ADDRESS={config['ip']} npm run build:prod -- --output-path {hot_water_tank_folder}/data"
    )
