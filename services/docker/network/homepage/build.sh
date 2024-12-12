ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for network homepage service to: ${ROOT_DIR}/services/docker/network/homepage/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/homepage/docker-compose.yml" "${ROOT_DIR}/services/docker/network/homepage/docker-compose.secret.yml"
echo "Building services for network homepage service to: ${ROOT_DIR}/services/docker/network/homepage/config/services.yaml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/network/homepage/config/services.template.yaml" "${ROOT_DIR}/services/docker/network/homepage/config/services.yaml"
