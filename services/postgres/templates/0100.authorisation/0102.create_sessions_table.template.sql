\connect ${postgres.authorisation.name};
CREATE TABLE IF NOT EXISTS ${postgres.authorisation.tables.sessions} (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES ${postgres.authorisation.tables.users}(id),
    created        TIMESTAMP NOT NULL,
    expires        TIMESTAMP NOT NULL,
    ip             TEXT NOT NULL,
    disabled       BOOLEAN DEFAULT FALSE
);