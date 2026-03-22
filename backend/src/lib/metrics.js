import client from 'prom-client';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which can be used to identify metrics
register.setDefaultLabels({
  app: 'chat-app-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections'
});

const messagesTotal = new client.Counter({
  name: 'messages_total',
  help: 'Total number of messages sent',
  labelNames: ['type'] // 'sent', 'received'
});

const databaseConnections = new client.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const userRegistrations = new client.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

const userLogins = new client.Counter({
  name: 'user_logins_total',
  help: 'Total number of user logins',
  labelNames: ['status'] // 'success', 'failure'
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(messagesTotal);
register.registerMetric(databaseConnections);
register.registerMetric(userRegistrations);
register.registerMetric(userLogins);

export {
  register,
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
  messagesTotal,
  databaseConnections,
  userRegistrations,
  userLogins
};
