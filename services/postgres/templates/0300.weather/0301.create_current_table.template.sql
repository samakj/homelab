\connect ${postgres.weather.name};
CREATE TABLE IF NOT EXISTS ${postgres.weather.tables.current} (
    id                      SERIAL PRIMARY KEY,
    timestamp               TIMESTAMP NOT NULL UNIQUE,
    sunrise                 TIMESTAMP NOT NULL,
    sunset                  TIMESTAMP NOT NULL,
    temperature             NUMERIC(8,4) NOT NULL,
    apparent_temperature    NUMERIC(8,4) NOT NULL,
    pressure                INTEGER NOT NULL,
    humidity                INTEGER NOT NULL,
    dew_point               NUMERIC(8,4) NOT NULL,
    cloud_coverage          INTEGER NOT NULL,
    visibility              INTEGER NOT NULL,
    wind_speed              NUMERIC(8,4) NOT NULL,
    wind_direction          INTEGER NOT NULL,
    owm_weather_id          INTEGER NOT NULL,
    owm_weather_title       TEXT NOT NULL,
    owm_weather_description TEXT NOT NULL,
    wind_gust               NUMERIC(8,4),
    uv_index                NUMERIC(8,4)
);