GET_DEVICE_BY_ID = """
SELECT id, mac, ip, websocket_path, location_id, last_message
FROM devices
WHERE id = {id}
"""

GET_DEVICE_BY_MAC = """
SELECT id, mac, ip, websocket_path, location_id, last_message
FROM devices
WHERE mac = {mac}
"""

GET_DEVICE_BY_IP = """
SELECT id, mac, ip, websocket_path, location_id, last_message
FROM devices
WHERE ip = {ip}
"""

GET_DEVICES = """
SELECT id, mac, ip, websocket_path, location_id, last_message
FROM devices
WHERE {where}
"""

CREATE_DEVICE = """
INSERT INTO devices(mac, ip, websocket_path, location_id)
VALUES ({mac}, {ip}, {websocket_path}, {location_id})
RETURNING id
"""

UPDATE_DEVICE = """
UPDATE devices
SET mac = {mac}, ip = {ip}, websocket_path = {websocket_path}, location_id = {location_id}
WHERE id = {id}
"""

DELETE_DEVICE = """
DELETE FROM devices
WHERE id = {id}
"""
