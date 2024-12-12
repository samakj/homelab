CREATE TABLE IF NOT EXISTS measurements (
    id          SERIAL PRIMARY KEY,
    timestamp   TIMESTAMP NOT NULL,
    device_id   INTEGER REFERENCES devices(id) NOT NULL,
    location_id INTEGER REFERENCES locations(id) NOT NULL,
    metric_id   INTEGER REFERENCES metrics(id) NOT NULL,
    tags        TEXT[],
    value       JSON
);