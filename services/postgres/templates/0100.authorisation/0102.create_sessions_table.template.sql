CREATE TABLE IF NOT EXISTS ${postgres.authorisation.name}.${postgres.authorisation.tables.sessions} {
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES ${postgres.authorisation.name}.user(id),
    expires        TIMESTAMP NOT NULL,
    ip             TEXT NOT NULL,
    scopes         TEXT[]
}