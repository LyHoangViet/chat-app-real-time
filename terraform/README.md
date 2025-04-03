# Terraform-DoAn
Use Terraform for configure infrastructure on AWS

# Configuration of Infrastructure with VPC, RDS, EC2, ...

# Requirements

- Terraform CLI
- AWS CLI (Use the following command to log in)

```bash
aws configure
```

> Note: you should use WSL or Ubuntu.

# Use the desired infrastructure.

- If you want use infrastructure Docker Swarm, you should use command:

```bash
cd ./deploy-infrastructure-dockerswarm/
```

- If you want use infrastructure Amazon ECS, you should use command:

```bash
cd ./deploy-infrastructure-ecs/
```

# Note

- If you want to change something, you should look into `./variable.tf`. All of variables are setup in there. Pay attention to these local variables

```hcl
# Setup local variables
locals {
  region = "ca-central-1"
  author = "DoAn"
  network_root_name = "DoAn-network"
  vpc_cidr = "10.0.0.0/16"
  compute_root_name = "DoAn-compute"
  key_name = "test-terraform"
  db_username = "admin"
  db_password = "DoAn123456"
  db_name = "Doandb"

  ec2_instances = [
    {
      name               = "my_server"
      ami                = "ami-0eb9fdcf0d07bd5ef"  # Ubuntu Server 24.04 LTS
      instance_type      = "t2.micro"
      subnet_id          = module.infrastructure_vpc.subnet_public1_id
      security_group_ids = [module.security.public_sg_id]
    },
    {
      name               = "server_node1"
      ami                = "ami-0eb9fdcf0d07bd5ef"  # Ubuntu Server 24.04 LTS
      instance_type      = "t2.micro"
      subnet_id          = module.infrastructure_vpc.subnet_private3_id
      security_group_ids = [module.security.private_sg_id]
    },
    {
      name               = "server_node2"
      ami                = "ami-0bfd2dd93f0dc6a8b"  # Microsoft Windows Server 2022 Base
      instance_type      = "t2.micro"
      subnet_id          = module.infrastructure_vpc.subnet_private4_id
      security_group_ids = [module.security.private_sg_id]
    },
  ]
}
```

- You must have a user that is granted enough permissions.

# Steps

## 1 - Deploy the infrastructure

Change current working directiry to `deploy-infrastructure`, you need to link modules in configuration with this command

```bash
cd ./Terraform-DoAn/deploy-infrastructure-dockerswarm/
# or
cd ./Terraform-DoAn/deploy-infrastructure-ecs/
```

Init **terraform**

```bash
terraform init
```

Now we have to validate our configuration and plan it

```bash
terraform plan
```

Then tell Terraform apply the plan to deploy our infrastructure (Terraform will ask you, just say "yes").

```bash
terraform apply
```

Result:

![2024-10-07_221831](https://github.com/user-attachments/assets/2bc86038-345b-4588-ae82-54abeed1471d)

## 2 - Clean up resources

Destroy resources (Terraform will ask you, just say "yes").

```bash
terraform destroy
```

![2024-10-07_225053](https://github.com/user-attachments/assets/4f3cef0e-5258-413b-88b8-c2ceba965a85)
