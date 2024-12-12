ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/home-assistant/build.sh";

echo "Recreating iot home assistant service"
docker compose -f "${ROOT_DIR}/services/docker/iot/home-assistant/docker-compose.secret.yml" up --force-recreate -d;