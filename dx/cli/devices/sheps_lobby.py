import click
import os

from variables import sheps_lobby_folder, shared_cpp_folder, device_ui_folder
from configs import apply_config_variables, get_devices_config
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def sheps_lobby() -> None:
    pass


@sheps_lobby.command()
def link_libs() -> None:
    os.system(f"rm -rf {sheps_lobby_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {sheps_lobby_folder / 'lib'}")


@sheps_lobby.command()
def build_config() -> None:
    apply_config_variables(
        input_path=sheps_lobby_folder / "src/config.template.h",
        output_path=sheps_lobby_folder / "src/config.h",
        template_prefix="${",
        template_suffix="}",
    )


@sheps_lobby.command()
def format() -> None:
    os.system(
        f"find {sheps_lobby_folder}/src -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )


@sheps_lobby.command()
def build_ui() -> None:
    config = get_devices_config()["sheps_lobby"]
    os.chdir(device_ui_folder)
    os.system(
        f"HOSTNAME={config['hostname']} IP_ADDRESS={config['ip']} npm run build:prod -- --output-path {sheps_lobby_folder}/data"
    )
