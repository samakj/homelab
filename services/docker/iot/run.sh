ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/api/run.sh"
. "${ROOT_DIR}/services/docker/iot/db/run.sh"
. "${ROOT_DIR}/services/docker/iot/portainer/run.sh"