output "endpoint" {
  value = aws_docdb_cluster.this.endpoint
}

output "security_group_id" {
  value = aws_security_group.docdb.id
}

