CREATE TABLE IF NOT EXISTS devices (
    id             SERIAL PRIMARY KEY,
    mac            TEXT NOT NULL UNIQUE,
    ip             TEXT NOT NULL UNIQUE,
    location_id    INTEGER REFERENCES locations(id) NOT NULL,
    last_message   TIMESTAMP
);
