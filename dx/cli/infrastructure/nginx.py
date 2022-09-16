import click

from configs import (
    apply_config_variables,
)
from variables import nginx_folder


@click.group()
def nginx() -> None:
    pass


@nginx.command()
def build() -> None:
    apply_config_variables(
        input_path=nginx_folder / "http.template",
        output_path=nginx_folder / "http.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | http built.")
    apply_config_variables(
        input_path=nginx_folder / "https.template",
        output_path=nginx_folder / "https.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | https built.")
    apply_config_variables(
        input_path=nginx_folder / "portainer.template",
        output_path=nginx_folder / "portainer.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("nginx | portainer built.")
