module "vpc" {
  source = "./modules/vpc" # Đường dẫn đến module hạ tầng
  
  # Input
  region            = local.region
  vpc_cidr          = local.vpc_cidr
  network_root_name = local.network_root_name
  author            = local.author
}

module "sg" {
  source = "./modules/sg"

  # Input
  region            = local.region
  author            = local.author
  network_root_name = local.network_root_name
  vpc_id            = module.vpc.vpc_id
}

module "ec2" {
  source = "./modules/ec2"

  # Input
  region             = local.region
  key_name           = local.key_name
  author             = local.author
  compute_root_name  = local.compute_root_name
  ec2_instances      = local.ec2_instances
}

module "alb" {
  source = "./modules/alb"

  # Input
  region            = local.region
  author            = local.author
  vpc_id            = module.vpc.vpc_id
  ec2_instance_ids  = module.ec2.ec2_instance_ids
  security_group_id = module.sg.public_sg_id
  subnet_ids        = [module.vpc.subnet_public1_id, module.vpc.subnet_public2_id]  # Truyền vào hai subnet
  target_group_name = local.target_group_name
  alb_name          = local.alb_name
}
