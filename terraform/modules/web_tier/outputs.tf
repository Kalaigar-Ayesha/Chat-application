output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "web_sg_id" {
  value = aws_security_group.web.id
}

