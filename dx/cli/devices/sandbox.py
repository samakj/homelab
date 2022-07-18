import click
import os

from variables import sandbox_folder, shared_cpp_folder
from configs import apply_config_variables


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
