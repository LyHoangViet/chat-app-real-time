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

sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker --version

sudo systemctl enable docker
sudo systemctl status docker

sudo apt update
sudo apt install docker-compose-plugin

# Kiểm tra version
docker compose version