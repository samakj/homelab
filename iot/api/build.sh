ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for iot api to: ${ROOT_DIR}/iot/api/src/config.secret.json"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/api/src/config.json" "${ROOT_DIR}/iot/api/src/config.secret.json"

echo "Building secrets for iot api Dockerfile to: ${ROOT_DIR}/iot/api/built.secret.Dockerfile"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/api/Dockerfile" "${ROOT_DIR}/iot/api/built.secret.Dockerfile"