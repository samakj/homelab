import click


from infrastructure.apis import apis, build as build_apis
from infrastructure.docker import docker
from infrastructure.frontend import frontend, build as build_frontend
from infrastructure.nginx import nginx, build as build_nginx
from infrastructure.scrapers import scrapers, build as build_scrapers


@click.group()
def infrastructure() -> None:
    pass


infrastructure.add_command(cmd=apis)
infrastructure.add_command(cmd=docker)
infrastructure.add_command(cmd=frontend)
infrastructure.add_command(cmd=nginx)
infrastructure.add_command(cmd=scrapers)


@infrastructure.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    build_nginx.invoke(ctx=ctx)
    build_apis.invoke(ctx=ctx)
    build_frontend.invoke(ctx=ctx)
    build_scrapers.invoke(ctx=ctx)
