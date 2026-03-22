#!/bin/bash

echo "🐳 Starting Docker Desktop Kubernetes..."

# Check if Docker Desktop is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker Desktop is not running."
    echo "💡 Please start Docker Desktop first."
    echo ""
    echo "🔧 Steps to enable Kubernetes in Docker Desktop:"
    echo "1. Open Docker Desktop"
    echo "2. Go to Settings → Kubernetes"
    echo "3. Check 'Enable Kubernetes'"
    echo "4. Click 'Apply & Restart'"
    echo "5. Wait for Kubernetes to start (may take several minutes)"
    exit 1
fi

# Check if Kubernetes is enabled in Docker Desktop
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ Kubernetes is not enabled in Docker Desktop."
    echo "💡 Please enable Kubernetes in Docker Desktop settings."
    exit 1
fi

echo "✅ Docker Desktop Kubernetes is running!"
kubectl cluster-info
kubectl get nodes

echo ""
echo "🎉 Kubernetes cluster is ready!"
echo ""
echo "📊 Next steps:"
echo "1. Run: ./setup-monitoring.sh"
echo "2. Deploy your chat application"
echo "3. Access monitoring dashboards"
