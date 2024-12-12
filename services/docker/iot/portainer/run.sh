ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/portainer/build.sh"

echo "Recreating iot portainer service"
docker compose -f "${ROOT_DIR}/services/docker/iot/portainer/docker-compose.secret.yml" up --force-recreate -d;