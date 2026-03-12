data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-web-alb-sg"
  description = "Web tier public ALB SG"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-web-alb-sg" }
}

resource "aws_security_group" "web" {
  name        = "${var.name_prefix}-web-asg-sg"
  description = "Web tier instances SG"
  vpc_id      = var.vpc_id

  ingress {
    description     = "HTTP from web ALB"
    from_port       = 80
    to_port         = 80
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

  tags = { Name = "${var.name_prefix}-web-asg-sg" }
}

resource "aws_lb" "this" {
  name               = "${var.name_prefix}-web-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "this" {
  name     = "${var.name_prefix}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    matcher             = "200-399"
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
  name = "${var.name_prefix}-web-ec2-role"

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
  name = "${var.name_prefix}-web-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

locals {
  nginx_conf = templatefile("${path.module}/../../user_data/nginx.conf.tftpl", {
    app_alb_dns_name = var.app_alb_dns_name
  })

  user_data = templatefile("${path.module}/../../user_data/web.sh.tftpl", {
    frontend_image = var.frontend_image
    nginx_conf     = local.nginx_conf
  })
}

resource "aws_launch_template" "this" {
  name_prefix   = "${var.name_prefix}-web-lt-"
  image_id      = data.aws_ami.al2023.id
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile {
    name = aws_iam_instance_profile.this.name
  }

  network_interfaces {
    device_index                = 0
    associate_public_ip_address = true
    security_groups             = [aws_security_group.web.id]
  }

  user_data = base64encode(local.user_data)

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.name_prefix}-web"
      Tier = "web"
    }
  }
}

resource "aws_autoscaling_group" "this" {
  name                = "${var.name_prefix}-web-asg"
  desired_capacity    = 2
  max_size            = 4
  min_size            = 1
  vpc_zone_identifier = var.public_subnet_ids
  target_group_arns   = [aws_lb_target_group.this.arn]
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.this.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.name_prefix}-web"
    propagate_at_launch = true
  }
}

