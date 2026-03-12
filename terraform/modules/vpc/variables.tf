variable "name_prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR"
}

variable "azs" {
  type        = list(string)
  description = "Availability zones"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDRs for public (web) subnets"
}

variable "app_subnet_cidrs" {
  type        = list(string)
  description = "CIDRs for private (app) subnets"
}

variable "db_subnet_cidrs" {
  type        = list(string)
  description = "CIDRs for private (db) subnets"
}

