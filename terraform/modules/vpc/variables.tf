# Biến để gán cho xác định khu vực region
variable "region" {
  description = "Region name of infrastructure"
  type = string
}

# Biến để thể hiện tên người dùng
variable "author" {
  description = "Creator of this resource"
  type = string
}

# Biến để tạo dải địa chỉ ip cho VPC
variable "vpc_cidr" {
  description = "CIDR Block of VPC"
  type = string
}

# Biến để tạo tên cho VPC
variable "network_root_name" {
  description = "Root name of Network (use for all VPC resources)"
  type = string
}