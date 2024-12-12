ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/misc/docs/build.sh";

echo "Creating proxy network";
docker network create proxy;

echo "Recreating docs service";
docker compose -f "${ROOT_DIR}/services/docker/misc/docs/docker-compose.yml" up --force-recreate -d;