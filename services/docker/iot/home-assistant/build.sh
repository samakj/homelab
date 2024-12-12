ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for iot home assistant service to: ${ROOT_DIR}/services/docker/iot/home-assistant/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/iot/home-assistant/docker-compose.yml" "${ROOT_DIR}/services/docker/iot/home-assistant/docker-compose.secret.yml" 