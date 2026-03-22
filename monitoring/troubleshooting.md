# Kubernetes Connection Troubleshooting

## ❌ Error: "cluster unreachable: Get \"http://localhost:8080/version\""

This error means **Kubernetes is not running** or not accessible.

## 🔧 Quick Fix Steps

### **Step 1: Start Docker Desktop**
```bash
# Open Docker Desktop application and wait for it to fully start
# You should see the Docker whale icon in your system tray
```

### **Step 2: Start Kubernetes Cluster**

#### Option A: Use Minikube (Recommended)
```bash
cd monitoring
chmod +x start-cluster.sh
./start-cluster.sh
```

#### Option B: Use Docker Desktop Kubernetes
```bash
cd monitoring
chmod +x start-docker-k8s.sh
./start-docker-k8s.sh
```

### **Step 3: Verify Cluster is Running**
```bash
kubectl cluster-info
kubectl get nodes
```

You should see output like:
```
Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   5m    v1.28.3
```

### **Step 4: Run Monitoring Setup**
```bash
./setup-monitoring.sh
```

## 🐛 Common Issues & Solutions

### **Issue 1: Docker Desktop not running**
**Symptoms:** `failed to connect to docker API`
**Solution:** Start Docker Desktop application

### **Issue 2: Minikube not installed**
**Symptoms:** `minikube: command not found`
**Solution:** Install Minikube
```bash
# Windows (Chocolatey)
choco install minikube

# Or download from https://minikube.sigs.k8s.io/docs/start/
```

### **Issue 3: Port conflicts**
**Symptoms:** `port 8080 is already in use`
**Solution:** Stop other services using port 8080 or use different cluster config

### **Issue 4: Insufficient resources**
**Symptoms:** `minikube start fails with memory errors`
**Solution:** Allocate more resources to Docker Desktop
- Open Docker Desktop → Settings → Resources
- Increase memory to at least 4GB
- Increase CPUs to at least 2

### **Issue 5: Kubernetes disabled in Docker Desktop**
**Symptoms:** `kubectl cluster-info fails`
**Solution:** Enable Kubernetes in Docker Desktop settings
- Docker Desktop → Settings → Kubernetes
- Check "Enable Kubernetes"
- Click "Apply & Restart"

## 🔄 Reset Commands

If everything fails, reset your cluster:

### **Reset Minikube**
```bash
minikube delete
minikube start --driver=docker --cpus=4 --memory=8192
```

### **Reset Docker Desktop Kubernetes**
```bash
# In Docker Desktop Settings → Kubernetes → Reset Kubernetes Cluster
```

## ✅ Verification Checklist

- [ ] Docker Desktop is running
- [ ] Kubernetes cluster is accessible (`kubectl cluster-info`)
- [ ] Nodes are ready (`kubectl get nodes`)
- [ ] Helm is installed (`helm version`)
- [ ] Monitoring namespace exists (`kubectl get ns monitoring`)

## 📞 Still Having Issues?

1. **Check Docker Desktop status** - Make sure it's fully started
2. **Restart Docker Desktop** - Sometimes a simple restart fixes issues
3. **Check system resources** - Ensure enough RAM/CPU is available
4. **Firewall/Antivirus** - Temporarily disable if blocking connections
5. **Reinstall tools** - As last resort, reinstall Docker Desktop and/or Minikube

## 🚀 Once Fixed

After your Kubernetes cluster is running, you'll be able to:
- Install monitoring stack successfully
- Deploy your chat application
- Access Grafana, Prometheus, and other monitoring tools
- View metrics and logs in real-time
