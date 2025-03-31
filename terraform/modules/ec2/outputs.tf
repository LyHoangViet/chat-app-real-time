# Outputs for EC2 Instances
output "ec2_instance_ids" {
  description = "List of EC2 Instance IDs"
  value       = [for inst in aws_instance.ec2_instances : inst.id]
}

output "ec2_instance_arns" {
  description = "List of EC2 Instance ARNs"
  value       = [for inst in aws_instance.ec2_instances : inst.arn]
}

output "ec2_instance_public_ips" {
  description = "List of EC2 Instance Public IPs"
  value       = [for inst in aws_instance.ec2_instances : inst.public_ip]
}

output "ec2_instance_private_ips" {
  description = "List of EC2 Instance Private IPs"
  value       = [for inst in aws_instance.ec2_instances : inst.private_ip]
}

output "ec2_instance_public_dns_names" {
  description = "List of EC2 Instance Public DNS Names"
  value       = [for inst in aws_instance.ec2_instances : inst.public_dns]
}

output "ec2_instance_private_dns_names" {
  description = "List of EC2 Instance Private DNS Names"
  value       = [for inst in aws_instance.ec2_instances : inst.private_dns]
}