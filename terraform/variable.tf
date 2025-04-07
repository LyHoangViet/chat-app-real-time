# Setup local variables
locals {
  region = "ap-southeast-1"
  author = "DoAn"

  # VPC
  network_root_name = "DoAn-network"
  vpc_cidr = "10.0.0.0/16"

  # EC2
  compute_root_name = "DoAn-compute"
  key_name = "doan-key"
    ec2_instances = [
    {
      name               = "ec2-test"
      ami                = "ami-0c1907b6d738188e5"  # Ubuntu Server 22.04 LTS
      instance_type      = "t2.medium"
      subnet_id          = module.vpc.subnet_public2_id
      security_group_ids = [module.sg.public_sg_id]
    },
  ]

  # Load Balancer
  target_group_name = "my-tg"
  alb_name = "Doan-alb"

  # IAM
  policy_name = "GrafanaCloudWatchReadPolicy"
  iam_name = "GrafanaEC2CloudWatchRole"
  iam_profile_name="GrafanaEC2CloudWatchIAM"

}
