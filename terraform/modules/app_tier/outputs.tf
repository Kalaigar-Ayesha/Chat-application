output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "app_sg_id" {
  value = aws_security_group.app.id
}

output "alb_sg_id" {
  value = aws_security_group.alb.id
}

