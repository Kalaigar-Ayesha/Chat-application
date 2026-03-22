#!/bin/bash

# Install Prometheus + Grafana monitoring stack using Helm

echo "🚀 Installing Prometheus + Grafana monitoring stack..."

# Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack (includes Prometheus, Grafana, AlertManager)
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.adminPassword=admin123 \
  --set grafana.service.type=LoadBalancer

echo "✅ Prometheus + Grafana installed successfully!"

# Wait for pods to be ready
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=monitoring -n monitoring --timeout=300s

# Show pod status
echo "📊 Pod status:"
kubectl get pods -n monitoring

echo ""
echo "🌐 Access Grafana:"
echo "kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80"
echo ""
echo "Login credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "🔍 Access Prometheus:"
echo "kubectl port-forward svc/monitoring-prometheus -n monitoring 9090:9090"
