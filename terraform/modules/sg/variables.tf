variable "region" {
  description = "Region name of infrastructure"
  type = string
}

variable "author" {
  description = "Creator of this resource"
  type = string
}

variable "network_root_name" {
  description = "Root name of Network (use for all VPC resources)"
  type = string
}

variable "vpc_id" {
  description = "Id of main VPC"
  type = string
}