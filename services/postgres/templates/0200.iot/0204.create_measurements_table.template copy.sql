\connect ${postgres.iot.name};
CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.measurements} (
    id          SERIAL PRIMARY KEY,
    timestamp   TIMESTAMP NOT NULL,
    device_id   INTEGER REFERENCES devices(id) NOT NULL,
    location_id INTEGER REFERENCES locations(id) NOT NULL,
    metric_id   INTEGER REFERENCES metrics(id) NOT NULL,
    tags        TEXT[],
    value_type  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.float_measurements} (
    id             SERIAL PRIMARY KEY,
    measurement_id INTEGER REFERENCES measurements(id) NOT NULL,
    value          NUMERIC(8,4)
);

CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.integer_measurements} (
    id             SERIAL PRIMARY KEY,
    measurement_id INTEGER REFERENCES measurements(id) NOT NULL,
    value          INTEGER
);

CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.string_measurements} (
    id             SERIAL PRIMARY KEY,
    measurement_id INTEGER REFERENCES measurements(id) NOT NULL,
    value          TEXT
);

CREATE TABLE IF NOT EXISTS ${postgres.iot.tables.boolean_measurements} (
    id             SERIAL PRIMARY KEY,
    measurement_id INTEGER REFERENCES measurements(id) NOT NULL,
    value          BOOLEAN
);