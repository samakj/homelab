\connect ${postgres.utilities.name};
CREATE TABLE IF NOT EXISTS ${postgres.utilities.tables.gas} (
    id                      SERIAL PRIMARY KEY,
    timestamp               TIMESTAMP NOT NULL UNIQUE,
    consumption             NUMERIC(8,4) NOT NULL
);