import click

from configs import apply_config_variables
from variables import frontend_service_folder


@click.group()
def frontend() -> None:
    pass


@frontend.command()
def build() -> None:
    apply_config_variables(
        input_path=frontend_service_folder / "src/config.template.ts",
        output_path=frontend_service_folder / "src/config.ts",
        template_prefix="${",
        template_suffix="}",
    )
