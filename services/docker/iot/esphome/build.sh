ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for iot esphome service to: ${ROOT_DIR}/services/docker/iot/esphome/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/iot/esphome/docker-compose.yml" "${ROOT_DIR}/services/docker/iot/esphome/docker-compose.secret.yml"

echo "Building secrets for iot esphome secrets to: ${ROOT_DIR}/services/docker/iot/esphome/config/secrets.yaml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/iot/esphome/config/secrets.template.yaml" "${ROOT_DIR}/services/docker/iot/esphome/config/secrets.yaml" 