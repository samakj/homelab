ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/misc/whatsapp/build.sh";

echo "Creating proxy network";
docker network create proxy;

echo "Recreating whatsapp service";
docker compose -f "${ROOT_DIR}/services/docker/misc/whatsapp/docker-compose.secret.yml" up --force-recreate -d;