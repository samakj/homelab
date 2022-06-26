GET_SESSION_BY_ID = """
SELECT id, user_id, expires, ip
FROM sessions
WHERE id = {id}
"""

GET_SESSIONS = """
SELECT id, user_id, expires, ip
FROM sessions
WHERE {where}
"""

CREATE_SESSION = """
INSERT INTO sessions(user_id, expires, ip)
VALUES ({user_id}, {expires}, {ip})
RETURNING id
"""

UPDATE_SESSION = """
UPDATE sessions
SET user_id = {user_id}, expires = {expires}, ip = {ip}
WHERE id = {id}
"""

DELETE_SESSION = """
DELETE FROM sessions
WHERE id = {id}
"""
