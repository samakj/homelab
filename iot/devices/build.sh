ROOT_DIR="${PWD%/homelab*}/homelab"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/devices/platformio.template.ini" "${ROOT_DIR}/iot/devices/platformio.ini" true