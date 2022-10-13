import click

from devices.conservatory import conservatory
from devices.hot_water_tank import hot_water_tank
from devices.living_room import living_room
from devices.sandbox import sandbox
from devices.sheps_lobby import sheps_lobby


@click.group()
def devices() -> None:
    pass


devices.add_command(cmd=conservatory)
devices.add_command(cmd=hot_water_tank)
devices.add_command(cmd=living_room)
devices.add_command(cmd=sandbox)
devices.add_command(cmd=sheps_lobby)
