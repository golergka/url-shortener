# syntax = docker/dockerfile:experimental

FROM node:14-alpine AS build_app

WORKDIR /usr/src/app/
RUN apk add make g++ gcc python

COPY package*.json /usr/src/app/
RUN npm ci

COPY . /usr/src/app
RUN npm run build

FROM node:14-alpine

EXPOSE 80
WORKDIR /app
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]

RUN apk add --no-cache tini

COPY --from=build_app /usr/src/app/node_modules /app/node_modules
COPY --from=build_app /usr/src/app/.build /app
COPY /migrations /app/migrations
COPY /views /app/views
COPY /public /app/public
COPY package*.json /app/