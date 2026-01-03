ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/cloudflare-tunnel/build.sh"

docker compose -f "${ROOT_DIR}/services/docker/network/cloudflare-tunnel/docker-compose.secret.yml" up --force-recreate -d;