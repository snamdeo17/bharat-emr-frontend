// Error logging and handling utilities

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const message = error.message || 'Unknown error';
  const stack = error.stack || '';
  
  const logEntry = {
    timestamp,
    level: LOG_LEVELS.ERROR,
    message,
    context,
    stack,
  };
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ERROR]', logEntry);
  }
  
  // Send to logging service in production
  if (import.meta.env.PROD) {
    sendToLoggingService(logEntry);
  }
  
  return logEntry;
};

const logWarn = (message, context = '') => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level: LOG_LEVELS.WARN, message, context };
  
  if (import.meta.env.DEV) {
    console.warn('[WARN]', logEntry);
  }
  
  return logEntry;
};

const logInfo = (message, context = '') => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level: LOG_LEVELS.INFO, message, context };
  
  if (import.meta.env.DEV) {
    console.log('[INFO]', logEntry);
  }
  
  return logEntry;
};

const sendToLoggingService = async (logEntry) => {
  try {
    // Send to your logging backend
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    });
  } catch (err) {
    console.error('Failed to send logs:', err);
  }
};

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    // Handle forbidden
    return 'You do not have permission to perform this action';
  } else if (error.response?.status >= 500) {
    // Handle server error
    return 'Server error. Please try again later';
  }
  
  return error.message || 'An error occurred';
};

export { logError, logWarn, logInfo, handleApiError, LOG_LEVELS };
