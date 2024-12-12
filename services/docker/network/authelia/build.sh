ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for authelia service to: ${ROOT_DIR}/services/docker/network/authelia/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/authelia/docker-compose.yml" "${ROOT_DIR}/services/docker/network/authelia/docker-compose.secret.yml"

echo "Building secrets for authelia config to: ${ROOT_DIR}/services/docker/network/authelia/configuration.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/authelia/configuration.yml" "${ROOT_DIR}/services/docker/network/authelia/configuration.secret.yml"