#!/bin/bash

# Install Loki + Promtail for log aggregation

echo "📜 Installing Loki + Promtail for log aggregation..."

# Add Grafana Helm repository
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Loki stack (includes Loki, Promtail, Grafana)
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=10Gi \
  --set promtail.enabled=true \
  --set grafana.enabled=false

echo "✅ Loki + Promtail installed successfully!"

# Wait for pods to be ready
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l release=loki -n monitoring --timeout=300s

# Show pod status
echo "📊 Pod status:"
kubectl get pods -n monitoring -l release=loki

echo ""
echo "🔍 View logs in Grafana:"
echo "1. Port forward Grafana: kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80"
echo "2. Go to Explore -> Select Loki"
echo "3. Query: {namespace=\"chat-app\"}"
echo ""
echo "🌐 Access Loki directly:"
echo "kubectl port-forward svc/loki -n monitoring 3100:3100"
