# Use the official Node.js image built on Alpine Linux
FROM node:24-alpine

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's caching mechanism
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Node.js app runs on internally
EXPOSE 3000

# The base container setup is complete; the startup command 
# is managed by Docker Compose to handle the database dependency.