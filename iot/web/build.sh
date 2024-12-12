ROOT_DIR="${PWD%/homelab*}/homelab"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/web/src/configs/hosts.ts" "${ROOT_DIR}/iot/web/src/configs/hosts.secret.ts"