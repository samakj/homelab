CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    TEXT NOT NULL,
    password    TEXT NOT NULL,
    scopes      TEXT[] NOT NULL
);