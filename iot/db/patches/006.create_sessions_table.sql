CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES devices(id) NOT NULL,
    created     TIMESTAMP NOT NULL,
    disabled    BOOLEAN DEFAULT FALSE
);