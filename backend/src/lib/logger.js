import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'chat-app-backend',
    version: process.env.APP_VERSION || '1.0.0'
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add structured logging methods
export const logUserAction = (action, userId, details = {}) => {
  logger.info('User action', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export const logHttpRequest = (method, route, statusCode, duration, userId = null) => {
  logger.info('HTTP request', {
    method,
    route,
    statusCode,
    duration: `${duration}ms`,
    userId,
    timestamp: new Date().toISOString()
  });
};

export const logError = (error, context = {}) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

export const logDatabaseOperation = (operation, collection, duration, success = true) => {
  logger.info('Database operation', {
    operation,
    collection,
    duration: `${duration}ms`,
    success,
    timestamp: new Date().toISOString()
  });
};

export const logWebSocketEvent = (event, userId, socketId) => {
  logger.info('WebSocket event', {
    event,
    userId,
    socketId,
    timestamp: new Date().toISOString()
  });
};

export default logger;
