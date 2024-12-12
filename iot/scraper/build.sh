ROOT_DIR="${PWD%/homelab*}/homelab"

echo "Building secrets for iot scraper to: ${ROOT_DIR}/iot/scraper/src/config.secret.json"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/scraper/src/config.json" "${ROOT_DIR}/iot/scraper/src/config.secret.json"

echo "Building secrets for iot scraper Dockerfile to: ${ROOT_DIR}/iot/scraper/built.secret.Dockerfile"
python3 "${ROOT_DIR}/scripts/build_secrets.py" "${ROOT_DIR}/iot/scraper/Dockerfile" "${ROOT_DIR}/iot/scraper/built.secret.Dockerfile"