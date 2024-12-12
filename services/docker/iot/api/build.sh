ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for iot api service to: ${ROOT_DIR}/services/docker/iot/api/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/iot/api/docker-compose.yml" "${ROOT_DIR}/services/docker/iot/api/docker-compose.secret.yml" 

. "${ROOT_DIR}/iot/api/build.sh"