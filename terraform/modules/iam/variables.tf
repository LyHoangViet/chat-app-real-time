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

# Biến để tạo tên cho policy
variable "policy_name" {
  description = "Name of Policy"
  type = string
}

# Biến để tạo tên cho IAM
variable "iam_name" {
  description = "Name of IAM"
  type = string
}

# Biến để tạo tên cho IAM profile
variable "iam_profile_name" {
  description = "Name of IAM profile"
  type = string
}