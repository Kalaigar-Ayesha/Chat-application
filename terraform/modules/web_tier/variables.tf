variable "name_prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnet IDs for web tier"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "key_name" {
  type        = string
  description = "Optional EC2 key pair name"
  default     = null
}

variable "ssh_ingress_cidr" {
  type        = string
  description = "CIDR allowed to SSH (null disables SSH ingress)"
  default     = null
}

variable "frontend_image" {
  type        = string
  description = "Frontend container image"
}

variable "app_alb_dns_name" {
  type        = string
  description = "Internal app ALB DNS name"
}

