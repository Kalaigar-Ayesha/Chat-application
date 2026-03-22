#!/bin/bash

# Install Jaeger for distributed tracing

echo "🧠 Installing Jaeger for distributed tracing..."

# Add Jaeger Helm repository
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo update

# Install Jaeger
helm install jaeger jaegertracing/jaeger \
  --namespace monitoring \
  --set provisionDataStore.cassandra=false \
  --set provisionDataStore.elasticsearch=false \
  --set storage.type=memory \
  --set service.type=LoadBalancer

echo "✅ Jaeger installed successfully!"

# Wait for pods to be ready
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=jaeger -n monitoring --timeout=300s

# Show pod status
echo "📊 Pod status:"
kubectl get pods -n monitoring -l app.kubernetes.io/instance=jaeger

echo ""
echo "🌐 Access Jaeger UI:"
echo "kubectl port-forward svc/jaeger-query -n monitoring 16686:16686"
echo ""
echo "📊 Access Jaeger Collector:"
echo "kubectl port-forward svc/jaeger-collector -n monitoring 14268:14268"
