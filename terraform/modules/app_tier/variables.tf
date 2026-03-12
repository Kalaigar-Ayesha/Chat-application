variable "name_prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR (used to restrict internal ALB ingress)"
}

variable "app_subnet_ids" {
  type        = list(string)
  description = "Private subnet IDs for app tier"
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

variable "backend_image" {
  type        = string
  description = "Backend container image"
}

variable "jwt_secret" {
  type        = string
  description = "JWT secret"
  sensitive   = true
}

variable "cloudinary_url" {
  type        = string
  description = "Cloudinary URL (optional)"
  sensitive   = true
  default     = ""
}

variable "docdb_endpoint" {
  type        = string
  description = "DocumentDB cluster endpoint"
}

variable "docdb_username" {
  type        = string
  description = "DocumentDB username"
}

variable "docdb_password" {
  type        = string
  description = "DocumentDB password"
  sensitive   = true
}

variable "docdb_db_name" {
  type        = string
  description = "Database name"
}

