\connect ${postgres.authorisation.name};
CREATE TABLE IF NOT EXISTS ${postgres.authorisation.tables.users} (
    id             SERIAL PRIMARY KEY,
    username       TEXT NOT NULL,
    password       TEXT NOT NULL,
    name           TEXT NOT NULL,
    scopes         TEXT[]
);