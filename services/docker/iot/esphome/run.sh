ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/esphome/build.sh";

echo "Recreating iot esphome service"
docker compose -f "${ROOT_DIR}/services/docker/iot/esphome/docker-compose.secret.yml" up --force-recreate -d;