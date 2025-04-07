# Output of Infrastructure
# VPC
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_arn" {
  value = module.vpc.vpc_arn
}

# Internet gateway
output "igw_id" {
  value = module.vpc.igw_id
}

output "igw_arn" {
  value = module.vpc.igw_arn
}

# Output of Security Group
output "public_sg_id" {
  value = module.sg.public_sg_id
}

output "public_sg_arn" {
  value = module.sg.public_sg_arn
}

# Output of EC2 
output "instance_ids" {
  value = module.ec2.ec2_instance_ids
}

output "instance_public_ips" {
  value = module.ec2.ec2_instance_public_ips
}

output "instance_private_ips" {
  value = module.ec2.ec2_instance_private_ips
}

# Output of ALB
output "target_group_id" {
  value = module.alb.target_group_id
}

output "alb_arn" {
  value = module.alb.alb_arn
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "listener_arn" {
  value = module.alb.listener_arn
}

# IAM
output "policy_id" {
  value = module.iam.policy_id
}

output "policy_arn" {
  value = module.iam.policy_arn
}

output "role_id" {
  value = module.iam.role_id
}

output "role_arn" {
  value = module.iam.role_arn
}

output "iam_profile" {
  value = module.iam.iam_profile
}

