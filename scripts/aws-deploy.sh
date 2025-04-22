
#!/bin/bash
# AWS Deployment Script for Incident Management System
# This script compresses all necessary files and prepares them for AWS deployment

set -e  # Exit immediately if a command exits with a non-zero status

echo "===== Incident Management System - AWS Deployment Package Creator ====="
echo "This script will create a deployment package for AWS EC2 instances"

# Create temporary directory for the deployment package
TEMP_DIR="deploy_package"
PACKAGE_NAME="incident-management-deploy.tar.gz"

# Clean up any existing package directory
if [ -d "$TEMP_DIR" ]; then
  echo "Cleaning up existing deployment directory..."
  rm -rf "$TEMP_DIR"
fi

mkdir -p "$TEMP_DIR"

# Copy only essential files for deployment
echo "Copying deployment files..."
cp docker-compose.yml "$TEMP_DIR/"
cp Dockerfile "$TEMP_DIR/"
cp nginx.conf "$TEMP_DIR/"
cp package.json "$TEMP_DIR/"
cp package-lock.json "$TEMP_DIR/" 2>/dev/null || echo "No package-lock.json found"
cp -r dist "$TEMP_DIR/" 2>/dev/null || echo "No dist folder found - you may need to build the application first"
cp -r src "$TEMP_DIR/" 2>/dev/null || echo "No src folder found"

# Copy deployment scripts
mkdir -p "$TEMP_DIR/scripts"
cp scripts/deploy-docker.sh "$TEMP_DIR/scripts/"
chmod +x "$TEMP_DIR/scripts/deploy-docker.sh"

# Create an AWS setup script
cat > "$TEMP_DIR/aws-setup.sh" << 'EOF'
#!/bin/bash
# AWS EC2 Instance Setup Script

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Set up AWS CloudWatch for logs (optional)
echo "Do you want to set up CloudWatch for container logs? (y/n)"
read setup_cloudwatch

if [ "$setup_cloudwatch" = "y" ]; then
    echo "Setting up CloudWatch agent..."
    sudo apt-get install -y amazon-cloudwatch-agent
    
    # Create CloudWatch config
    sudo mkdir -p /opt/aws/cloudwatch
    cat > /tmp/cloudwatch-config.json << 'CWCONFIG'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/lib/docker/containers/**/*.log",
            "log_group_name": "incident-management-containers",
            "log_stream_name": "{instance_id}-{container_name}",
            "timestamp_format": "%Y-%m-%dT%H:%M:%S.%fZ"
          }
        ]
      }
    }
  }
}
CWCONFIG
    sudo mv /tmp/cloudwatch-config.json /opt/aws/cloudwatch/config.json
    sudo amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/cloudwatch/config.json -s
fi

echo "Setup complete! Now you can start the application with: docker-compose up -d"
EOF

chmod +x "$TEMP_DIR/aws-setup.sh"

# Create a README with deployment instructions
cat > "$TEMP_DIR/README.md" << 'EOF'
# Incident Management System - AWS Deployment

## Quick Start

1. Upload this package to your AWS EC2 instance
2. Extract the package: `tar -xzf incident-management-deploy.tar.gz`
3. Run the setup script: `./aws-setup.sh`
4. Start the application: `docker-compose up -d`

## Deployment Options

### EC2 Instance (this package)

This package is designed for deploying on an EC2 instance. It includes all necessary files and setup scripts.

### ECS/Fargate Deployment

For production environments, consider using AWS ECS or Fargate with the following services:
- ECS for container orchestration
- ECR for container registry
- RDS for managed MongoDB (or DocumentDB)
- ElastiCache for managed Redis
- EFS for persistent storage
- CloudWatch for monitoring and logging

## Monitoring

After deployment, you can monitor your application:
- Access the frontend: http://your-ec2-instance-ip:8080
- MongoDB: localhost:27017 (not exposed externally by default)
- Redis: localhost:6379 (not exposed externally by default)

## Troubleshooting

If you encounter issues:
1. Check container status: `docker-compose ps`
2. View logs: `docker-compose logs -f`
3. Restart services: `docker-compose restart`
EOF

# Compress the package
echo "Creating compressed deployment package..."
tar -czvf "$PACKAGE_NAME" -C "$TEMP_DIR" .

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "===== Deployment Package Created Successfully! ====="
echo "Package: $PACKAGE_NAME"
echo ""
echo "To deploy on AWS EC2:"
echo "1. Upload $PACKAGE_NAME to your EC2 instance"
echo "2. SSH into your instance"
echo "3. Extract: tar -xzf $PACKAGE_NAME"
echo "4. Run setup: ./aws-setup.sh"
echo "5. Start system: ./start.sh or docker-compose up -d"
echo ""
echo "For more deployment options, see the included README.md"

