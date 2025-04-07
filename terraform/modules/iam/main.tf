# 1. Create IAM Policy
resource "aws_iam_policy" "grafana_cloudwatch_policy" {
  name        = var.policy_name
  description = "Policy for EC2 reading CloudWatch metrics used Grafana"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowReadingMetricsFromCloudWatch",
        Effect = "Allow",
        Action = [
          "cloudwatch:DescribeAlarmsForMetric",
          "cloudwatch:ListMetrics",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetMetricData"
        ],
        Resource = "*"
      },
      {
        Sid    = "AllowReadingTagsInstancesRegionsFromEC2",
        Effect = "Allow",
        Action = [
          "ec2:DescribeTags",
          "ec2:DescribeInstances",
          "ec2:DescribeRegions"
        ],
        Resource = "*"
      },
      {
        Sid    = "AllowReadingResourcesForTags",
        Effect = "Allow",
        Action = "tag:GetResources",
        Resource = "*"
      }
    ]
  })
}

# 2. Tạo IAM Role cho EC2
resource "aws_iam_role" "grafana_ec2_role" {
  name = var.iam_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# 3. Gán Policy vào Role
resource "aws_iam_role_policy_attachment" "grafana_attach" {
  role       = aws_iam_role.grafana_ec2_role.id
  policy_arn = aws_iam_policy.grafana_cloudwatch_policy.arn
}

resource "aws_iam_instance_profile" "grafana_instance_profile" {
  name = "${var.iam_profile_name}-profile"
  role = var.iam_name
}