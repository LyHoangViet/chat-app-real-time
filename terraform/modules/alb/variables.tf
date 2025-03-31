variable "region" {
  description = "Region name of infrastructure"
  type = string
}

variable "author" {
  description = "Creator of this resource"
  type = string
}

variable "vpc_id" {
  description = "Id of VPC"
  type = string
}

variable "ec2_instance_ids" {
  description = "Id of EC2"
  type = list(string)
}

variable "security_group_id" {
  description = "Security Group ID for the ALB"
  type        = string
}

variable "subnet_ids" {
  description = "List of Subnet IDs for ALB"
  type        = list(string)
}

variable "target_group_name" {
  description = "Name of Service Discovery Namespace"
  type = string
}

variable "alb_name" {
  description = "Name of Service Discovery Service"
  type = string
}