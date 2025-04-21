
#!/bin/bash
# Jenkins deployment script

# Make script executable: chmod +x scripts/deploy-jenkins.sh

echo "Starting deployment process..."

# Check if required environment variables are set
if [ -z "$DOCKER_IMAGE" ] || [ -z "$DOCKER_TAG" ]; then
    echo "Error: DOCKER_IMAGE or DOCKER_TAG environment variables are not set"
    exit 1
fi

# Pull the latest image
echo "Pulling Docker image: $DOCKER_IMAGE:$DOCKER_TAG"
docker pull $DOCKER_IMAGE:$DOCKER_TAG || { echo "Failed to pull image"; exit 1; }

# Update the image tag in the docker-compose file
echo "Updating docker-compose.yml with the new image tag"
sed -i "s|image: .*frontend.*|image: $DOCKER_IMAGE:$DOCKER_TAG|g" docker-compose.yml

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose not found, attempting to install..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Restart only the frontend service
echo "Restarting frontend service"
docker-compose up -d --no-deps frontend

echo "Deployment completed successfully!"
echo "The application is running at http://localhost:8080"

# Check if the container is running
if docker-compose ps | grep -q frontend; then
    echo "Frontend container is running."
else
    echo "WARNING: Frontend container is not running. Check docker logs."
    docker-compose logs frontend
    exit 1
fi
