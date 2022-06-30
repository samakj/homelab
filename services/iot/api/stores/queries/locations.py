GET_LOCATION_BY_ID = """
SELECT id, name, tags
FROM locations
WHERE id = {id}
"""

GET_LOCATION_BY_NAME = """
SELECT id, name, tags
FROM locations
WHERE name = {name}
"""

GET_LOCATIONS = """
SELECT id, name, tags
FROM locations
WHERE {where}
"""

CREATE_LOCATION = """
INSERT INTO locations(name, tags)
VALUES ({name}, {tags})
RETURNING id
"""

UPDATE_LOCATION = """
UPDATE locations
SET name = {name}, tags = {tags}
WHERE id = {id}
"""

DELETE_LOCATION = """
DELETE FROM locations
WHERE id = {id}
"""
