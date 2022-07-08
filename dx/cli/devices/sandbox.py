import click
import os

from variables import sandbox_folder, shared_cpp_folder


@click.group()
def sandbox() -> None:
    pass


@sandbox.command()
def link_libs():
    os.system(f"rm -rf {sandbox_folder / 'lib'}")
    os.system(f"ln -s {shared_cpp_folder}/ {sandbox_folder / 'lib'}")
