import click
import os

from variables import living_room_folder, shared_cpp_folder, device_ui_folder
from configs import apply_config_variables, get_devices_config
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def living_room() -> None:
    pass


@living_room.command()
def link_libs() -> None:
    os.system(f"rm -rf {living_room_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {living_room_folder / 'lib'}")


@living_room.command()
def build_config() -> None:
    apply_config_variables(
        input_path=living_room_folder / "src/config.template.h",
        output_path=living_room_folder / "src/config.h",
        template_prefix="${",
        template_suffix="}",
    )


@living_room.command()
def format() -> None:
    os.system(
        f"find {living_room_folder}/src -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )


@living_room.command()
def build_ui() -> None:
    config = get_devices_config()["living_room"]
    os.chdir(device_ui_folder)
    os.system(
        f"HOSTNAME={config['hostname']} IP_ADDRESS={config['ip']} npm run build:prod -- --output-path {living_room_folder}/data"
    )
