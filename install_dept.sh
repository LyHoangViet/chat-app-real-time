#!/bin/bash

echo "Starting installation script..."

# Update system
echo "Updating system..."
sudo apt update
sudo apt upgrade -y

# Install Node.js
echo "Installing Node.js..."
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
echo "Node.js version:"
node -v
echo "NPM version:"
npm -v

# Install MongoDB
echo "Installing MongoDB..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

echo "MongoDB status:"
sudo systemctl status mongod

# Install Yarn
echo "Installing Yarn..."
sudo npm install --global yarn

echo "Yarn version:"
yarn --version
