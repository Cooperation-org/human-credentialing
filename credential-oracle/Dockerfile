FROM node:16.13-alpine3.14

RUN apk add --no-cache chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY ./src ./src
COPY ./prisma ./prisma

RUN npx prisma generate
