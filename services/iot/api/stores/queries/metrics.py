GET_METRIC_BY_ID = """
SELECT id, name, abbreviation, unit
FROM metrics
WHERE id = {id}
"""

GET_METRIC_BY_NAME = """
SELECT id, name, abbreviation, unit
FROM metrics
WHERE name = {name}
"""

GET_METRIC_BY_ABBREVIATION = """
SELECT id, name, abbreviation, unit
FROM metrics
WHERE abbreviation = {abbreviation}
"""

GET_METRICS = """
SELECT id, name, abbreviation, unit
FROM metrics
WHERE {where}
"""

CREATE_METRIC = """
INSERT INTO metrics(name, abbreviation, unit)
VALUES ({name}, {abbreviation}, {unit})
RETURNING id
"""

UPDATE_METRIC = """
UPDATE metrics
SET name = {name}, abbreviation = {abbreviation}, unit = {unit}
WHERE id = {id}
"""

DELETE_METRIC = """
DELETE FROM metrics
WHERE id = {id}
"""
