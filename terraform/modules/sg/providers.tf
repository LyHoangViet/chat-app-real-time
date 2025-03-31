# Setup provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Dùng biến đã tạo để xác định khu vực region
provider "aws" {
  region = var.region
}