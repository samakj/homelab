ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for network portainer service to: ${ROOT_DIR}/services/docker/network/portainer/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/portainer/docker-compose.yml" "${ROOT_DIR}/services/docker/network/portainer/docker-compose.secret.yml"
