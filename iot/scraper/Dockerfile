FROM node:23-alpine

WORKDIR /api

COPY package-lock.json .
COPY package.json .
COPY tsconfig.json .
COPY src .

RUN npm install
RUN npm run link

EXPOSE {{ hosts.iot.api.port }}

CMD [ "npm", "run", "dev" ]