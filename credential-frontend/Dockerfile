FROM node:19-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --silent

# Copy the rest of the application code to the container
COPY . .

CMD yarn start