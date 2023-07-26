# Create image based on the official Node image from dockerhub
FROM node:lts-buster AS development
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json yarn.lock /usr/src/app/

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["yarn", "start"]