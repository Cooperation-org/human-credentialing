FROM node:16.13-alpine3.14

RUN apk add --no-cache chromium

WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --silent

COPY ./scripts ./scripts

COPY ./src ./src
COPY ./prisma ./prisma

COPY . .

RUN npx prisma generate

CMD yarn deploy:composite && yarn start
