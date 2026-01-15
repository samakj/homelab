ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for whatsapp service to: ${ROOT_DIR}/services/docker/misc/whatsapp/docker-compose.secret.yml"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/misc/whatsapp/docker-compose.yml" "${ROOT_DIR}/services/docker/misc/whatsapp/docker-compose.secret.yml"

echo "Building secrets for whatsapp service to: ${ROOT_DIR}/services/docker/misc/whatsapp/.env.secret"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/services/docker/misc/whatsapp/.env" "${ROOT_DIR}/services/docker/misc/whatsapp/.env.secret"