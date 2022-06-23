import click

from configs import (
    apply_config_variables,
)
from variables import nginx_folder


@click.group()
def nginx() -> None:
    pass


@nginx.command()
def build_iot_scraper() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/iot_scraper.template",
        output_path=nginx_folder / "scrapers/iot_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | iot_scraper.conf built.")


@nginx.command()
def build_frontend() -> None:
    apply_config_variables(
        input_path=nginx_folder / "frontend.template",
        output_path=nginx_folder / "frontend.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | frontend.conf built.")


@nginx.command()
def build_http() -> None:
    apply_config_variables(
        input_path=nginx_folder / "http.template",
        output_path=nginx_folder / "http.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | http.conf built.")


@nginx.command()
def build_https() -> None:
    apply_config_variables(
        input_path=nginx_folder / "https.template",
        output_path=nginx_folder / "https.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | https.conf built.")


@nginx.command()
def build_iot_api() -> None:
    apply_config_variables(
        input_path=nginx_folder / "apis/iot_api.template",
        output_path=nginx_folder / "apis/iot_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | iot_api.conf built.")


@nginx.command()
def build_portainer() -> None:
    apply_config_variables(
        input_path=nginx_folder / "portainer.template",
        output_path=nginx_folder / "portainer.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | portainer.conf built.")


@nginx.command()
def build_apis() -> None:
    apply_config_variables(
        input_path=nginx_folder / "apis.template",
        output_path=nginx_folder / "apis.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | apis.conf built.")


@nginx.command()
def build_utilities_api() -> None:
    apply_config_variables(
        input_path=nginx_folder / "apis/utilities_api.template",
        output_path=nginx_folder / "apis/utilities_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | utilities_api.conf built.")


@nginx.command()
def build_utilities_scraper() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/utilities_scraper.template",
        output_path=nginx_folder / "scrapers/utilities_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | utilities_scraper.conf built.")


@nginx.command()
def build_weather_api() -> None:
    apply_config_variables(
        input_path=nginx_folder / "apis/weather_api.template",
        output_path=nginx_folder / "apis/weather_api.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | weather_api.conf built.")


@nginx.command()
def build_weather_scraper() -> None:
    apply_config_variables(
        input_path=nginx_folder / "scrapers/weather_scraper.template",
        output_path=nginx_folder / "scrapers/weather_scraper.conf",
        template_prefix="${",
        template_suffix="}",
    )
    print("Nginx | weather_scraper.conf built.")


@nginx.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_iot_scraper.invoke(ctx=ctx)
    build_frontend.invoke(ctx=ctx)
    build_http.invoke(ctx=ctx)
    build_https.invoke(ctx=ctx)
    build_iot_api.invoke(ctx=ctx)
    build_portainer.invoke(ctx=ctx)
    build_apis.invoke(ctx=ctx)
    build_utilities_api.invoke(ctx=ctx)
    build_utilities_scraper.invoke(ctx=ctx)
    build_weather_api.invoke(ctx=ctx)
    build_weather_scraper.invoke(ctx=ctx)
