import click
import os

from variables import shared_cpp_folder
from clang_format import CLANG_FORMAT_STYLE


@click.group()
def cpp() -> None:
    pass


@cpp.command()
def format() -> None:
    os.system(
        f"find {shared_cpp_folder} -type f -name '*.cpp' -or -name '*.h' -or -name '*.tpp' | xargs clang-format -i -style='{CLANG_FORMAT_STYLE}'"
    )
