ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/api/build.sh"
. "${ROOT_DIR}/services/docker/iot/db/build.sh"
. "${ROOT_DIR}/services/docker/iot/portainer/build.sh"