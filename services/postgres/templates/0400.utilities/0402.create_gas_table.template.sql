CREATE TABLE IF NOT EXISTS ${postgres.utilities.name}.${postgres.utilties.tables.gas} (
    id                      SERIAL PRIMARY KEY,
    timestamp               TIMESTAMP NOT NULL UNIQUE,
    consumption             NUMERIC(8,4) NOT NULL
);