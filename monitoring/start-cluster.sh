#!/bin/bash

echo "🚀 Starting Kubernetes cluster..."

# Check if Docker Desktop is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    echo "💡 Open Docker Desktop and wait for it to fully start."
    exit 1
fi

# Start Minikube with appropriate resources
echo "🔄 Starting Minikube..."
minikube delete  # Clean up any existing broken state
minikube start --driver=docker --cpus=2 --memory=3072 --disk-size=10g

# Enable required addons
echo "🔧 Enabling Minikube addons..."
minikube addons enable metrics-server
minikube addons enable ingress

# Verify cluster is running
echo "✅ Checking cluster status..."
kubectl cluster-info
kubectl get nodes

echo ""
echo "🎉 Kubernetes cluster is ready!"
echo ""
echo "📊 Next steps:"
echo "1. Run: ./setup-monitoring.sh"
echo "2. Deploy your chat application"
echo "3. Access monitoring dashboards"
