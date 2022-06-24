\connect ${postgres.iot.name};
CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.metrics} (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE,
    unit         TEXT
);