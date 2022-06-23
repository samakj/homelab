import click
import os
from pathlib import Path

from configs import (
    apply_config_variables,
    get_postgres_config,
    get_hosts_config,
    get_ports_config,
)
from variables import postgres_service_folder


@click.group()
def postgres() -> None:
    pass


@postgres.command()
def build_patch_files() -> None:
    patches_folder = postgres_service_folder / "patches"
    templates_folder = postgres_service_folder / "templates"
    if not os.path.exists(patches_folder):
        os.makedirs(patches_folder)

    for folder, _, files in os.walk(templates_folder):
        for file in files:
            input_path = Path(folder) / file
            output_file = str(file).replace(".template", "")
            output_path = patches_folder / output_file
            apply_config_variables(
                input_path=input_path,
                output_path=output_path,
                template_prefix="${",
                template_suffix="}",
            )
            print(f"Postgres | {output_file} built.")


@postgres.command()
def export_data() -> None:
    data_folder = postgres_service_folder / "data"
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)

    _postgres_config = get_postgres_config()
    host = get_hosts_config()["db"]
    port = get_ports_config()["postgres"]

    for database, config in _postgres_config.items():
        database_folder = data_folder / database
        for table in config.get("tables").values():
            print(f"Trying to export {database}.{table} data")
            table_file = f"{database_folder}/{table}.csv"
            if os.path.exists(table_file):
                print("Renamed old export file")
                os.rename(table_file, f"{database_folder}/{table}.old.csv")

            psql_command = (
                f"PGPASSWORD='{_postgres_config['root']['password']}' "
                + f"psql --host={host} --port={port} "
                + f"--db={_postgres_config[database]['name']} "
                + f"--username={_postgres_config['root']['user']} "
                + f"--command=\"\copy {table} TO '{table_file}.csv' "
                + "DELIMITER ',' CSV HEADER;\""
            )

            os.system(psql_command)


@postgres.command()
def import_data() -> None:
    data_folder = postgres_service_folder / "data"
    if not os.path.exists(data_folder):
        print("Data folder doesn't exist")
        return

    _postgres_config = get_postgres_config()
    host = get_hosts_config()["db"]
    port = get_ports_config()["postgres"]

    for database, config in _postgres_config.items():
        database_folder = data_folder / database
        for table in config.get("tables").values():
            print(f"Trying to import {database}.{table} data")
            table_file = f"{database_folder}/{table}.csv"
            if os.path.exists(table_file):
                print(f"{table} csv file {table_file} doesn't exist")
                continue

            psql_command = (
                f"PGPASSWORD='{_postgres_config['root']['password']}' "
                + f"psql --host={host} --port={port} "
                + f"--db={_postgres_config[database]['name']} "
                + f"--username={_postgres_config['root']['user']} "
                + f"--command=\"\copy {table} FROM '{table_file}.csv' "
                + "DELIMITER ',' CSV HEADER;\""
            )

            os.system(psql_command)
