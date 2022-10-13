import click

from devices.conservatory import conservatory
from devices.sandbox import sandbox
from devices.hot_water_tank import hot_water_tank


@click.group()
def devices() -> None:
    pass


devices.add_command(cmd=conservatory)
devices.add_command(cmd=sandbox)
devices.add_command(cmd=hot_water_tank)
