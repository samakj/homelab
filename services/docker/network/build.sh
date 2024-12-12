ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/network/authelia/build.sh"
. "${ROOT_DIR}/services/docker/network/homepage/build.sh"
. "${ROOT_DIR}/services/docker/network/traefik/build.sh"
. "${ROOT_DIR}/services/docker/network/portainer/build.sh"