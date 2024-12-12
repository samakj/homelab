ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for traefik service to: ${ROOT_DIR}/services/docker/network/traefik/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/traefik/docker-compose.yml" "${ROOT_DIR}/services/docker/network/traefik/docker-compose.secret.yml"

echo "Building secrets for traefik config to: ${ROOT_DIR}/services/docker/network/traefik/config.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/traefik/config.yml" "${ROOT_DIR}/services/docker/network/traefik/config.secret.yml"