# Policy
output "policy_id" {
  value = aws_iam_policy.grafana_cloudwatch_policy.id
}

output "policy_arn" {
  value = aws_iam_policy.grafana_cloudwatch_policy.arn
}

# IAM
output "role_id" {
  value = aws_iam_role.grafana_ec2_role.id
}

output "role_arn" {
  value = aws_iam_role.grafana_ec2_role.arn
}

# IAM profile
output "iam_profile" {
  value = aws_iam_instance_profile.grafana_instance_profile.name
}