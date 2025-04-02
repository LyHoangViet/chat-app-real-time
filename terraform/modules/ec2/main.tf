# Tạo EC2 Instances
resource "aws_instance" "ec2_instances" {
  for_each = { for inst in var.ec2_instances : inst.name => inst }

  ami                    = each.value.ami
  instance_type          = each.value.instance_type
  key_name               = var.key_name
  subnet_id              = each.value.subnet_id
  vpc_security_group_ids = each.value.security_group_ids

   user_data = <<-EOF
    #!/bin/bash
    sudo apt update -y
    sudo apt upgrade -y

    # Install Docker dependencies
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add Docker repository and install Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Clone Git repository
    git clone https://github.com/LyHoangViet/chat-app-real-time.git

    # Run docker compose
    

  EOF

  tags = {
    Name   = "${var.compute_root_name}-${each.value.name}"
    Type   = "EC2"
    Author = var.author
  }
}