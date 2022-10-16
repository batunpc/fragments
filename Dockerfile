# = Dockerfile =

# This file is necessary to build the image for the container that will run the application
# reference: https://docs.docker.com/engine/reference/builder/

# The FROM instruction initializes a new build stage and sets the Base Image for subsequent instructions.
# Use node version 16.15.1
FROM node:16.15.1

LABEL maintainer="Batuhan Ipci"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
