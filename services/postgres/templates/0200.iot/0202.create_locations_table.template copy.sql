CREATE TABLE IF NOT EXISTS ${postgres.iot.name}.${postgres.iot.tables.locations} (
    id             SERIAL PRIMARY KEY,
    mac            TEXT NOT NULL UNIQUE,
    ip             TEXT NOT NULL UNIQUE,
    websocket_path TEXT DEFAULT '',
    location_id    INTEGER NOT NULL,
    last_message   TIMESTAMP
);