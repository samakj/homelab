CREATE TABLE IF NOT EXISTS ${postgres.authorisation.name}.${postgres.authorisation.tables.users} {
    id             SERIAL PRIMARY KEY,
    username       TEXT NOT NULL,
    password       TEXT NOT NULL,
    name           TEXT NOT NULL,
    scopes         TEXT[]
}