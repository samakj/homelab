import click

from configs import apply_config_variables
from variables import redis_service_folder


@click.group()
def redis() -> None:
    pass


@redis.command()
def build() -> None:
    template_file = redis_service_folder / "redis.template"
    output_file = redis_service_folder / "redis.conf"
    apply_config_variables(
        input_path=template_file,
        output_path=output_file,
        template_prefix="${",
        template_suffix="}",
    )
    print(f"Redis | {output_file} built.")
