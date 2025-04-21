
#!/bin/bash
# Simple deployment script for Linux environments

echo "This project is now configured to use Docker containers."
echo "Please use the Docker deployment script instead:"
echo ""
echo "  ./scripts/deploy-docker.sh"
echo ""
echo "This will set up three containers:"
echo "1. Frontend with Nginx"
echo "2. MongoDB database"
echo "3. Redis cache"
echo ""
echo "If you need to install Docker first, the deploy-docker.sh script will help you."

# Make deploy-docker.sh executable
chmod +x ./scripts/deploy-docker.sh
