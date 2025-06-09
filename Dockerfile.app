FROM node:22.16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY ./doc/api.yaml ./dist/doc/api.yaml
COPY . .

CMD ["npm", "run", "start:dev"]
