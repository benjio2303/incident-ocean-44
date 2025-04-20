
#!/bin/bash
# Simple deployment script for Linux environments

# Make sure you have Node.js installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js version 18 or higher."
    exit 1
fi

# Install dependencies
npm install

# Build application
npm run build

# Start the application with PM2 for process management
# Install PM2 if not available
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 process manager..."
    npm install -g pm2
fi

# Start application with PM2
pm2 start npm --name "incident-ocean" -- run preview

echo "Application deployed! Access at http://localhost:8080"
echo "To check logs: pm2 logs incident-ocean"
echo "To restart: pm2 restart incident-ocean"
