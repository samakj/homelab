\connect ${postgres.authorisation.name};
GRANT ALL PRIVILEGES ON DATABASE ${postgres.authorisation.name} TO ${postgres.authorisation.user};
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO ${postgres.authorisation.user};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${postgres.authorisation.user};

\connect ${postgres.iot.name};
GRANT ALL PRIVILEGES ON DATABASE ${postgres.iot.name} TO ${postgres.iot.user};
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO ${postgres.iot.user};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${postgres.iot.user};

\connect ${postgres.utilities.name};
GRANT ALL PRIVILEGES ON DATABASE ${postgres.utilities.name} TO ${postgres.utilities.user};
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO ${postgres.utilities.user};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${postgres.utilities.user};

\connect ${postgres.weather.name};
GRANT ALL PRIVILEGES ON DATABASE ${postgres.weather.name} TO ${postgres.weather.user};
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO ${postgres.weather.user};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${postgres.weather.user};
