FROM node:16.13-buster

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY ./src ./src
COPY ./public ./public
COPY .env ./

RUN yarn build