ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/api/build.sh";

echo "Recreating iot api service"
docker compose -f "${ROOT_DIR}/services/docker/iot/api/docker-compose.secret.yml" up --force-recreate -d;