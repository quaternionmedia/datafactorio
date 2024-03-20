#!/bin/bash

# Set the network name
NETWORK_NAME="graphbase_network"

# Set the Docker image name for the Graphbase API
IMAGE_NAME="graphbase_image"

# Set MongoDB credentials
MONGO_USER="root"
MONGO_PASSWORD="example"

# Start MongoDB container
echo -e
echo "Starting MongoDB container..."
docker run -d --name mongodb -p 27017:27017 mongo:latest
# docker run -d --name mongodb -e MONGO_INITDB_ROOT_USERNAME=$MONGO_USER -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD -p 27017:27017 mongo:latest

# Wait for MongoDB to fully start
echo -e
echo "Waiting for MongoDB to start..."
sleep 10

# Create the Docker network
echo -e
echo "Creating network..."
docker network create $NETWORK_NAME

# Connect MongoDB to the network
echo -e
echo "Adding database to network..."
docker network connect $NETWORK_NAME mongodb

# Build the Graphbase Docker image
echo -e
echo "Building graphbase api image..."
docker build -t $IMAGE_NAME -f Dockerfile .

# Create and start the Graphbase API container
echo -e
echo "Starting graphbase api service..."
docker run -d --name graphbase_api \
    -p 8000:8000 \
    -e MONGODB_URL="mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/" \
    --network $NETWORK_NAME \
    $IMAGE_NAME

echo -e
echo "Graphbase API and MongoDB have been started."
echo -e
echo -e
echo "Access the Swagger UI at http://localhost:8000/docs"
