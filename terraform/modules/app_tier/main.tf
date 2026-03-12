data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-app-alb-sg"
  description = "App tier internal ALB SG"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from VPC CIDR"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-app-alb-sg" }
}

resource "aws_security_group" "app" {
  name        = "${var.name_prefix}-app-asg-sg"
  description = "App tier instances SG"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Backend from app ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  dynamic "ingress" {
    for_each = var.ssh_ingress_cidr == null ? [] : [var.ssh_ingress_cidr]
    content {
      description = "SSH (optional)"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-app-asg-sg" }
}

resource "aws_lb" "this" {
  name               = "${var.name_prefix}-app-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.app_subnet_ids
}

resource "aws_lb_target_group" "this" {
  name     = "${var.name_prefix}-app-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health"
    matcher             = "200"
    interval            = 15
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.name_prefix}-app-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "this" {
  name = "${var.name_prefix}-app-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

locals {
  mongodb_uri = "mongodb://${var.docdb_username}:${urlencode(var.docdb_password)}@${var.docdb_endpoint}:27017/${var.docdb_db_name}?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
  user_data = templatefile("${path.module}/../../user_data/app.sh.tftpl", {
    backend_image  = var.backend_image
    mongodb_uri    = local.mongodb_uri
    jwt_secret     = var.jwt_secret
    cloudinary_url = var.cloudinary_url
  })
}

resource "aws_launch_template" "this" {
  name_prefix   = "${var.name_prefix}-app-lt-"
  image_id      = data.aws_ami.al2023.id
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile {
    name = aws_iam_instance_profile.this.name
  }

  network_interfaces {
    device_index                = 0
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
  }

  user_data = base64encode(local.user_data)

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.name_prefix}-app"
      Tier = "app"
    }
  }
}

resource "aws_autoscaling_group" "this" {
  name                = "${var.name_prefix}-app-asg"
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  vpc_zone_identifier = var.app_subnet_ids
  target_group_arns   = [aws_lb_target_group.this.arn]
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.this.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.name_prefix}-app"
    propagate_at_launch = true
  }
}

