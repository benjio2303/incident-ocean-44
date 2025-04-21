
#!/bin/bash
# Jenkins deployment script

# Make script executable: chmod +x scripts/deploy-jenkins.sh

# Pull the latest image
docker pull $DOCKER_IMAGE:$DOCKER_TAG

# Update the image tag in the docker-compose file
sed -i "s|image: .*frontend.*|image: $DOCKER_IMAGE:$DOCKER_TAG|g" docker-compose.yml

# Restart only the frontend service
docker-compose up -d --no-deps frontend

echo "Deployment completed successfully!"
echo "The application is running at http://localhost:8080"

# Check if the container is running
if docker-compose ps | grep -q frontend; then
    echo "Frontend container is running."
else
    echo "WARNING: Frontend container is not running. Check docker logs."
fi
