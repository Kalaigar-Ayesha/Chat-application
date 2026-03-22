# Chat Application Observability Stack

This directory contains the complete monitoring and observability setup for the Chat Application.

## 📊 Architecture Overview

```
Frontend (React) → Backend (Node.js) → Database (MongoDB)
                     ↓
              Observability Layer:
              ┌─────────────────────────────────┐
              │ Prometheus → Metrics Collection │
              │ Grafana → Dashboards & Visualization │
              │ Loki → Log Aggregation          │
              │ Promtail → Log Collector        │
              │ Jaeger → Distributed Tracing    │
              └─────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Install Complete Stack
```bash
cd monitoring
chmod +x *.sh
./setup-monitoring.sh
```

### 2. Access Services

**Grafana:**
```bash
kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80
# Visit: http://localhost:3000
# Username: admin, Password: admin123
```

**Prometheus:**
```bash
kubectl port-forward svc/monitoring-prometheus -n monitoring 9090:9090
# Visit: http://localhost:9090
```

**Jaeger:**
```bash
kubectl port-forward svc/jaeger-query -n monitoring 16686:16686
# Visit: http://localhost:16686
```

**Loki:**
```bash
kubectl port-forward svc/loki -n monitoring 3100:3100
# Visit: http://localhost:3100
```

## 📈 Metrics Available

### Application Metrics
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - HTTP request duration histogram
- `websocket_active_connections` - Active WebSocket connections
- `messages_total` - Total messages sent/received
- `database_connections_active` - Active database connections
- `user_registrations_total` - User registrations
- `user_logins_total` - User logins (success/failure)

### System Metrics
- CPU usage
- Memory usage
- Filesystem usage
- Network traffic
- Pod restarts

## 📜 Logging

### Structured Logging Format
```json
{
  "level": "info",
  "message": "User action",
  "action": "login",
  "userId": "123",
  "timestamp": "2024-03-17T12:00:00.000Z",
  "service": "chat-app-backend"
}
```

### Log Queries in Grafana
- All application logs: `{namespace="chat-app"}`
- Backend logs: `{app="backend"}`
- Error logs: `{level="error"}`
- User actions: `{action="login"}`

## ⚠️ Alerting

### Configured Alerts
- **High CPU Usage** - CPU > 50% for 2 minutes
- **High Memory Usage** - Memory > 80% for 2 minutes
- **Backend Pod Restart** - Pod restart detected
- **High HTTP Error Rate** - Error rate > 10% for 1 minute
- **High HTTP Response Time** - 95th percentile > 1 second for 2 minutes
- **Database Connection High** - Connections > 80 for 5 minutes
- **WebSocket Connections High** - Connections > 1000 for 5 minutes
- **Pod Not Ready** - Pod not ready for 1 minute
- **Node Filesystem Usage** - Filesystem > 85% for 5 minutes

### Alert Management
Alerts are configured in `alert-rules.yaml` and can be viewed in:
- **Prometheus**: Alerts tab
- **Grafana**: Alerting section
- **AlertManager**: Configure notification channels (Slack, email, etc.)

## 🧠 Tracing

### Jaeger Integration
To add distributed tracing to your backend:

```javascript
import { initTracer } from 'jaeger-client';

const tracer = initTracer({
  serviceName: 'chat-app-backend',
  reporter: {
    collectorEndpoint: 'http://jaeger-collector:14268/api/traces'
  }
});
```

## 📊 Grafana Dashboard

### Import Dashboard
1. Go to Grafana → Dashboards → Import
2. Upload `grafana-dashboard.json`
3. Select Prometheus as data source

### Dashboard Panels
- HTTP Requests Rate
- HTTP Response Time (95th percentile)
- Active WebSocket Connections
- Messages Total
- HTTP Status Codes
- Database Connections
- User Registrations
- User Logins
- CPU Usage
- Memory Usage

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `setup-monitoring.sh` | Complete setup script |
| `install-prometheus-grafana.sh` | Prometheus + Grafana installation |
| `install-loki-promtail.sh` | Loki + Promtail installation |
| `install-jaeger.sh` | Jaeger installation |
| `alert-rules.yaml` | Prometheus alert rules |
| `grafana-dashboard.json` | Pre-configured Grafana dashboard |
| `../kubernetes/backend-servicemonitor.yaml` | ServiceMonitor for backend metrics |

## 🛠️ Backend Integration

The backend has been enhanced with:

### Metrics (`src/lib/metrics.js`)
- Prometheus client setup
- Custom metrics for application-specific data
- Default metrics collection

### Logging (`src/lib/logger.js`)
- Winston-based structured logging
- Specialized logging functions for different events
- JSON format for better parsing

### Enhanced App (`src/app.js`)
- Metrics endpoint at `/metrics`
- Request tracking middleware
- Error handling for metrics generation

## 📱 Monitoring Best Practices

1. **Set up alerts** for critical metrics
2. **Monitor logs** for errors and unusual patterns
3. **Use tracing** to identify performance bottlenecks
4. **Review dashboards** regularly for trends
5. **Set up notification channels** in AlertManager
6. **Document custom metrics** for team visibility

## 🚨 Troubleshooting

### Common Issues
1. **Metrics not showing**: Check ServiceMonitor configuration
2. **Logs not appearing**: Verify Promtail configuration
3. **Alerts not firing**: Check PrometheusRule configuration
4. **Dashboard not loading**: Verify data source connection

### Debug Commands
```bash
# Check pod status
kubectl get pods -n monitoring

# Check logs
kubectl logs -n monitoring deployment/monitoring-prometheus

# Check ServiceMonitor
kubectl get servicemonitor -n monitoring

# Check Prometheus targets
kubectl port-forward svc/monitoring-prometheus -n monitoring 9090:9090
# Visit: http://localhost:9090/targets
```

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [Kubernetes Monitoring](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
