import click
import os

from variables import conservatory_folder, shared_cpp_folder, device_ui_folder
from configs import apply_config_variables, get_devices_config
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def conservatory() -> None:
    pass


@conservatory.command()
def link_libs() -> None:
    os.system(f"rm -rf {conservatory_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {conservatory_folder / 'lib'}")


@conservatory.command()
def build_config() -> None:
    apply_config_variables(
        input_path=conservatory_folder / "src/config.template.h",
        output_path=conservatory_folder / "src/config.h",
        template_prefix="${",
        template_suffix="}",
    )


@conservatory.command()
def format() -> None:
    os.system(
        f"find {conservatory_folder}/src -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )


@conservatory.command()
def build_ui() -> None:
    config = get_devices_config()["conservatory"]
    os.chdir(device_ui_folder)
    os.system(
        f"HOSTNAME={config['hostname']} IP_ADDRESS={config['ip']} npm run build:prod -- --output-path {conservatory_folder}/data"
    )
