ROOT_DIR="${PWD%/homelab*}/homelab"

. "${ROOT_DIR}/services/docker/iot/build.sh"
. "${ROOT_DIR}/services/docker/network/build.sh"
. "${ROOT_DIR}/services/docker/misc/build.sh"