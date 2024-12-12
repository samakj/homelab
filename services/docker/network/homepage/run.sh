ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/homepage/build.sh"

docker compose -f "${ROOT_DIR}/services/docker/network/homepage/docker-compose.secret.yml" up --force-recreate -d;