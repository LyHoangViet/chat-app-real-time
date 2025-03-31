variable "region" {
  description = "Region name of infrastructure"
  type        = string
}

variable "key_name" {
  description = "Name of SSH Key Pair"
  type        = string
}

variable "author" {
  description = "Creator of this resource"
  type        = string
}

variable "compute_root_name" {
  description = "Root name of Compute services"
  type        = string
}

variable "ec2_instances" {
  description = "A list of EC2 instances to create"
  type = list(object({
    name          = string
    ami           = string
    instance_type = string
    subnet_id     = string
    security_group_ids = list(string)
  }))
}

