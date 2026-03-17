#!/bin/bash

# Install ArgoCD
echo "Installing ArgoCD..."
kubectl create namespace argocd
kubectl apply -n argocd -f ../argocd-install.yaml

# Wait for ArgoCD to be ready
echo "Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd
kubectl wait --for=condition=available --timeout=300s deployment/argocd-repo-server -n argocd
kubectl wait --for=condition=available --timeout=300s deployment/argocd-application-controller -n argocd

# Create chat-app application
echo "Creating chat-app application..."
kubectl apply -f chat-app-application.yaml

# Get initial password
echo "Getting initial ArgoCD admin password..."
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

echo ""
echo "ArgoCD installation complete!"
echo ""
echo "To access the ArgoCD UI, run:"
echo "kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo ""
echo "Then open https://localhost:8080 in your browser"
echo "Login with username: admin and the password shown above"
