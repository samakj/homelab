ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/db/build.sh";

echo "Recreating iot db service"
docker compose -f "${ROOT_DIR}/services/docker/iot/db/docker-compose.secret.yml" up --force-recreate -d;