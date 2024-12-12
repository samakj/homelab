ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/portainer/build.sh"

docker compose -f "${ROOT_DIR}/services/docker/network/portainer/docker-compose.secret.yml" up --force-recreate -d;