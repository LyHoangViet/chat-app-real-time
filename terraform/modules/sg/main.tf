# Setup Security Group public
resource "aws_security_group" "public_sg" {
  description = "Allow access to server"
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.network_root_name}-sg-public"
    Type = "Security-Group"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_1" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 22
  to_port = 22
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule1"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_2" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 80
  to_port = 80
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule2"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_3" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 443
  to_port = 443
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule3"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_4" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 5000
  to_port = 5000
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule4"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_5" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 3000
  to_port = 3000
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule5"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_6" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 3001
  to_port = 3001
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule6"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_ingress_rule" "public_sg_inbound_7" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  # Port
  from_port = 27017
  to_port = 27017
  # Protocol
  ip_protocol = "tcp"
  tags = {
    Name = "${var.network_root_name}-sg-public-inbound-rule7"
    Type = "Security-Group-Inbound-Rule"
    Author = var.author
  }
}

resource "aws_vpc_security_group_egress_rule" "public_sg_outbound" {
  security_group_id = aws_security_group.public_sg.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "-1"
  tags = {
    Name = "${var.network_root_name}-sg-public-outbound-rule1"
    Type = "Security-Group-Outbound-Rule"
    Author = var.author
  }
}

