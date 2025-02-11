#!/bin/bash

# Định nghĩa file marker
DOCKER_MARKER="/usr/local/etc/.docker-installed"

# Function kiểm tra Docker đã cài đặt chưa
check_docker() {
    if command -v docker &> /dev/null && command -v docker compose &> /dev/null; then
        return 0  # Docker đã cài đặt
    else
        return 1  # Docker chưa cài đặt
    fi
}

# Kiểm tra marker file và Docker
if [ -f "\$DOCKER_MARKER" ] && check_docker; then
    echo "Docker đã được cài đặt trước đó."
    echo "Docker version:"
    docker --version
    echo "Docker Compose version:"
    docker compose version
    exit 0
fi

echo "Starting installation docker..."

# Cài đặt các dependencies
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Thêm Docker repository
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \$(. /etc/os-release && echo "\$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cập nhật và cài đặt Docker
sudo apt update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Kiểm tra cài đặt
if check_docker; then
    echo "Docker cài đặt thành công!"
    
    # Hiển thị versions
    echo "Docker version:"
    sudo docker --version
    echo "Docker Compose version:"
    docker compose version
    
    # Enable và kiểm tra status
    sudo systemctl enable docker
    sudo systemctl status docker
    
    # Tạo marker file
    sudo mkdir -p /usr/local/etc
    echo "Docker installed on \$(date)" | sudo tee \$DOCKER_MARKER
else
    echo "Cài đặt Docker thất bại!"
    exit 1
fi