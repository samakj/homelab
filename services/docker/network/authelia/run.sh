ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/authelia/build.sh";

echo "Creating proxy network"
docker network create proxy;

echo "Recreating authelia service"
docker compose -f "${ROOT_DIR}/services/docker/network/authelia/docker-compose.secret.yml" up --force-recreate -d;