GET_MEASUREMENT_BY_ID = """
 SELECT measurements.id,
        timestamp,
        device_id,
        location_id,
        metric_id,
        tags,
        value_type,
        float_measurements.value as float_value,
        integer_measurements.value as integer_value,
        string_measurements.value as string_value,
        boolean_measurements.value as boolean_value
FROM measurements
LEFT JOIN float_measurements ON measurements.id = float_measurements.measurement_id
LEFT JOIN integer_measurements ON measurements.id = integer_measurements.measurement_id
LEFT JOIN string_measurements ON measurements.id = string_measurements.measurement_id
LEFT JOIN boolean_measurements ON measurements.id = boolean_measurements.measurement_id
WHERE measurements.id={id}
"""

GET_LATEST_MEASUREMENTS = """
SELECT DISTINCT ON (location_id, metric_id, tags)
       measurements.id,
       timestamp,
       device_id,
       location_id,
       metric_id,
       tags,
       value_type,
       float_measurements.value as float_value,
       integer_measurements.value as integer_value,
       string_measurements.value as string_value,
       boolean_measurements.value as boolean_value
FROM measurements
LEFT JOIN float_measurements ON measurements.id = float_measurements.measurement_id
LEFT JOIN integer_measurements ON measurements.id = integer_measurements.measurement_id
LEFT JOIN string_measurements ON measurements.id = string_measurements.measurement_id
LEFT JOIN boolean_measurements ON measurements.id = boolean_measurements.measurement_id
WHERE {where}
ORDER BY location_id, metric_id, tags, timestamp DESC
"""

GET_MEASUREMENTS = """
SELECT measurements.id,
       timestamp,
       device_id,
       location_id,
       metric_id,
       tags,
       value_type,
       float_measurements.value as float_value,
       integer_measurements.value as integer_value,
       string_measurements.value as string_value,
       boolean_measurements.value as boolean_value
FROM measurements
LEFT JOIN float_measurements ON measurements.id = float_measurements.measurement_id
LEFT JOIN integer_measurements ON measurements.id = integer_measurements.measurement_id
LEFT JOIN string_measurements ON measurements.id = string_measurements.measurement_id
LEFT JOIN boolean_measurements ON measurements.id = boolean_measurements.measurement_id
WHERE {where}
"""

CREATE_MEASUREMENT = """
INSERT INTO measurements (timestamp, device_id, location_id, metric_id, tags, value_type)
VALUES ({timestamp}, {device_id}, {location_id}, {metric_id}, {tags}, {value_type})
RETURNING id
"""

CREATE_MEASUREMENT_VALUE = """
INSERT INTO {value_type}_measurements (measurement_id, value)
VALUES ({measurement_id}, {value})
"""
