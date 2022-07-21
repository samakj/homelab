import click
import os

from variables import sandbox_folder, shared_cpp_folder, device_ui_folder
from configs import apply_config_variables, get_devices_config
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def sandbox() -> None:
    pass


@sandbox.command()
def link_libs() -> None:
    os.system(f"rm -rf {sandbox_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {sandbox_folder / 'lib'}")


@sandbox.command()
def build_config() -> None:
    apply_config_variables(
        input_path=sandbox_folder / "src/config.template.h",
        output_path=sandbox_folder / "src/config.h",
        template_prefix="${",
        template_suffix="}",
    )


@sandbox.command()
def format() -> None:
    os.system(
        f"find {sandbox_folder}/src -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )


@sandbox.command()
def build_ui() -> None:
    config = get_devices_config()["sandbox"]
    os.chdir(device_ui_folder)
    os.system(
        f"HOSTNAME={config['hostname']} IP_ADDRESS={config['ip']} npm run build:prod -- --output-path {sandbox_folder}/data"
    )
