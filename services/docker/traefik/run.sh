. ./build.sh;
docker network create proxy;
docker compose -f docker-compose.secret.yml up --force-recreate -d;