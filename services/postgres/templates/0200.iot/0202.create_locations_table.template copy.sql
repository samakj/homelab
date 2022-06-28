\connect ${postgres.iot.name};
CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.locations} (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    tags TEXT[] NOT NULL
);