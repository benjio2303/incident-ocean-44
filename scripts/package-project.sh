
#!/bin/bash
# Script to package the entire project for deployment

set -e  # Exit on any error

echo "=== Packaging Incident Management System ==="

# Define variables
PACKAGE_NAME="incident-management-system.tar.gz"
TEMP_DIR="package_temp"

# Clean up any existing package
rm -f $PACKAGE_NAME
rm -rf $TEMP_DIR

# Create temporary directory
mkdir -p $TEMP_DIR

# Copy all necessary files
echo "Copying project files..."

# Core configuration files
cp package*.json $TEMP_DIR/ 2>/dev/null || echo "No package.json files found"
cp docker-compose.yml $TEMP_DIR/
cp Dockerfile $TEMP_DIR/
cp nginx.conf $TEMP_DIR/
cp README.md $TEMP_DIR/ 2>/dev/null || echo "No README.md found"

# Source code and built files
cp -r src/ $TEMP_DIR/ 2>/dev/null || echo "No src directory found"
cp -r public/ $TEMP_DIR/ 2>/dev/null || echo "No public directory found"
cp -r dist/ $TEMP_DIR/ 2>/dev/null || echo "No dist directory found"

# Configuration files
cp tsconfig*.json $TEMP_DIR/ 2>/dev/null || echo "No TypeScript config files found"
cp vite.config.* $TEMP_DIR/ 2>/dev/null || echo "No Vite config found"
cp postcss.config.js $TEMP_DIR/ 2>/dev/null || echo "No PostCSS config found"
cp tailwind.config.* $TEMP_DIR/ 2>/dev/null || echo "No Tailwind config found"

# CI/CD files
cp Jenkinsfile $TEMP_DIR/ 2>/dev/null || echo "No Jenkinsfile found"

# Scripts directory
cp -r scripts/ $TEMP_DIR/ 2>/dev/null || echo "No scripts directory found"

# Create start script
cat > $TEMP_DIR/start.sh << 'EOF'
#!/bin/bash
set -e

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Installing..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "Starting Incident Management System..."

# Build and start containers
docker-compose up -d --build

echo "System started! Access it at http://localhost:8080"
EOF

chmod +x $TEMP_DIR/start.sh

# Create the archive
echo "Creating deployment package..."
tar -czf $PACKAGE_NAME -C $TEMP_DIR .

# Clean up
rm -rf $TEMP_DIR

echo "=== Packaging Complete ==="
echo "Package created: $PACKAGE_NAME"
echo ""
echo "To deploy:"
echo "1. Copy $PACKAGE_NAME to your server"
echo "2. Extract it: tar -xzf $PACKAGE_NAME"
echo "3. Run ./start.sh"
echo ""
echo "The system will be available at http://localhost:8080"
