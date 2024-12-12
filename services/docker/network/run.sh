ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/authelia/run.sh"
. "${ROOT_DIR}/services/docker/network/homepage/run.sh"
. "${ROOT_DIR}/services/docker/network/traefik/run.sh"
. "${ROOT_DIR}/services/docker/network/portainer/run.sh"