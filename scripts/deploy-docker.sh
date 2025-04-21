
#!/bin/bash
# Docker-based deployment script

# Make script executable: chmod +x scripts/deploy-docker.sh

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed. Please log out and log back in to use Docker without sudo."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed."
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

echo "Application deployed with three containers:"
echo "1. Frontend: http://localhost:8080"
echo "2. MongoDB: localhost:27017"
echo "3. Redis: localhost:6379"
echo ""
echo "To check container status: docker-compose ps"
echo "To view logs: docker-compose logs -f"
echo "To stop the application: docker-compose down"
