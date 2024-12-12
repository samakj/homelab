ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/traefik/build.sh";

echo "Creating proxy network";
docker network create proxy;

echo "Recreating traefik service";
docker compose -f "${ROOT_DIR}/services/docker/network/traefik/docker-compose.secret.yml" up --force-recreate -d;