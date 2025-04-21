
#!/bin/bash

# Make script executable: chmod +x scripts/restart-jenkins.sh

echo "Restarting Jenkins container..."
docker-compose stop jenkins
docker-compose rm -f jenkins
docker-compose up -d jenkins

echo "Jenkins is now restarting at http://localhost:8090/"
echo "Default credentials: admin/admin"

# Wait for Jenkins to start
echo "Waiting for Jenkins to start up..."
sleep 10

# Check if Jenkins is running
if curl -s -I http://localhost:8090/ | grep -q "200 OK"; then
    echo "Jenkins is running correctly!"
else
    echo "Jenkins might still be starting up. Please wait a moment and try accessing http://localhost:8090/"
    echo "If you still have issues, check the logs with: docker-compose logs jenkins"
fi
