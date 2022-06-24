GET_USER_BY_ID = """
SELECT id, username, password, name, scopes
FROM users
WHERE id = {id}
"""
