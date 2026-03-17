# ArgoCD GitOps Setup for Chat Application

This directory contains the ArgoCD configuration for deploying the chat application using GitOps.

## Files

- `chat-app-application.yaml` - ArgoCD Application manifest
- `install-argocd.sh` - Installation script
- `../argocd-install.yaml` - ArgoCD installation manifest (downloaded from official repo)

## Quick Start

### 1. Install ArgoCD

```bash
cd argocd
chmod +x install-argocd.sh
./install-argocd.sh
```

### 2. Access ArgoCD UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open https://localhost:8080 in your browser.

**Default credentials:**
- Username: `admin`
- Password: Run the following command to get the password:
  ```bash
  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
  ```

### 3. Verify Application Deployment

The ArgoCD application will automatically deploy your chat application to the `chat-app` namespace.

```bash
# Check application status
kubectl get applications -n argocd

# Check deployed pods
kubectl get pods -n chat-app

# Check services
kubectl get svc -n chat-app
```

## Configuration

### Repository Configuration

The application is configured to sync with:
- **Repository**: `https://github.com/Kalaigar-Ayesha/Chat-application.git`
- **Path**: `Helm` (the Helm chart directory)
- **Target Revision**: `HEAD` (latest commit)
- **Destination Namespace**: `chat-app`

### Sync Policy

- **Automated Sync**: Enabled
- **Prune**: Enabled (removes resources when deleted from Git)
- **Self Heal**: Enabled (automatically fixes drift)
- **Create Namespace**: Automatically creates the `chat-app` namespace

### Environment Configuration

The application is configured to use `production` environment values. You can modify the `parameters` section in `chat-app-application.yaml` to change environment-specific values.

## Manual Operations

### Sync Application Manually

```bash
argocd app sync chat-app
```

### Get Application Status

```bash
argocd app get chat-app
```

### View Application Logs

```bash
argocd app logs chat-app
```

## Troubleshooting

### Common Issues

1. **Application not syncing**: Check the repository URL and path in the application manifest.
2. **Helm chart issues**: Verify the Helm chart structure and values files.
3. **Permission issues**: Ensure ArgoCD has sufficient permissions to deploy to the target namespace.

### Useful Commands

```bash
# Get ArgoCD server logs
kubectl logs -n argocd deployment/argocd-server

# Get application controller logs
kubectl logs -n argocd deployment/argocd-application-controller

# Check application details
kubectl get application chat-app -n argocd -o yaml

# Force refresh application
argocd app refresh chat-app
```

## GitOps Workflow

1. **Make changes** to your Helm chart or values files
2. **Commit and push** changes to the repository
3. **ArgoCD automatically detects** the changes and syncs the application
4. **Monitor deployment** through the ArgoCD UI or CLI

The application will continuously monitor the Git repository and automatically apply any changes to maintain the desired state defined in your Helm chart.
