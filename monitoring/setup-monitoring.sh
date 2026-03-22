#!/bin/bash

# Complete monitoring setup script for Chat Application

echo "🚀 Setting up complete observability stack for Chat Application..."

# Create monitoring namespace if it doesn't exist
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

echo "📊 Step 1: Installing Prometheus + Grafana..."
./install-prometheus-grafana.sh

echo "📜 Step 2: Installing Loki + Promtail..."
./install-loki-promtail.sh

echo "🧠 Step 3: Installing Jaeger..."
./install-jaeger.sh

echo "⚠️ Step 4: Applying alert rules..."
kubectl apply -f alert-rules.yaml

echo "📈 Step 5: Applying ServiceMonitor for backend..."
kubectl apply -f ../kubernetes/backend-servicemonitor.yaml

echo ""
echo "✅ Complete observability stack installed!"
echo ""
echo "🌐 Access URLs:"
echo "Grafana: http://localhost:3000 (admin/admin123)"
echo "Prometheus: http://localhost:9090"
echo "Jaeger: http://localhost:16686"
echo "Loki: http://localhost:3100"
echo ""
echo "📊 Port forwarding commands:"
echo "# Grafana"
echo "kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80"
echo ""
echo "# Prometheus"
echo "kubectl port-forward svc/monitoring-prometheus -n monitoring 9090:9090"
echo ""
echo "# Jaeger"
echo "kubectl port-forward svc/jaeger-query -n monitoring 16686:16686"
echo ""
echo "# Loki"
echo "kubectl port-forward svc/loki -n monitoring 3100:3100"
echo ""
echo "📈 Import Grafana Dashboard:"
echo "1. Go to Grafana -> Dashboards -> Import"
echo "2. Upload the grafana-dashboard.json file"
echo "3. Select Prometheus as data source"
echo ""
echo "🔍 Log queries in Grafana:"
echo "- View application logs: {namespace=\"chat-app\"}"
echo "- View backend logs: {app=\"backend\"}"
echo "- View error logs: {level=\"error\"}"
