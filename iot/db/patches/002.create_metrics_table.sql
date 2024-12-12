CREATE TABLE IF NOT EXISTS metrics (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE,
    unit         TEXT
);