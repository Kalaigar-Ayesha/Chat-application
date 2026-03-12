# AWS Multi-Tier (Chat App) with Terraform

This Terraform config deploys a **scalable, resilient multi-tier architecture** specifically for this repo:

- **Web tier**: public ALB + ASG running the `frontend/` container (nginx) and proxying `/api` + `/socket.io` to the app tier
- **App tier**: internal ALB + ASG running the `backend/` container on port **5000**
- **Data tier**: Amazon **DocumentDB** (MongoDB-compatible) in private subnets, reachable only from the app tier

## Folder layout

- `terraform/` root module (wires everything)
- `terraform/modules/vpc` VPC, subnets, IGW, NAT, route tables
- `terraform/modules/web_tier` public ALB + ASG (frontend)
- `terraform/modules/app_tier` internal ALB + ASG (backend)
- `terraform/modules/docdb` DocumentDB cluster + subnet group + security group

## Prerequisites

- Terraform \(>= 1.6\)
- AWS credentials configured (env vars, shared credentials file, or SSO)
- Container images available for the EC2 instances to pull:
  - `frontend_image` should be built from `frontend/Dockerfile`
  - `backend_image` should be built from `backend/Dockerfile`

## Quick start

From repo root:

```bash
cd terraform
terraform init
terraform plan -var-file="secrets.tfvars"
terraform apply -var-file="secrets.tfvars"
```

Create:
- `terraform/terraform.tfvars` (copy from `terraform.tfvars.example`)
- `terraform/secrets.tfvars` (keep out of git)

`secrets.tfvars` example:

```hcl
jwt_secret           = "replace-me"
docdb_master_password = "replace-me"
cloudinary_url       = ""
```

After apply, open the `web_alb_dns_name` output in your browser.

