/**
 * Logging utility - only logs in development mode
 * Use this instead of console.log to avoid production console spam
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log messages only in development mode
 */
export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  table: (data: any) => {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  },
};

/**
 * Always log errors regardless of environment
 */
export const productionLog = {
  error: (...args: any[]) => {
    console.error(...args);
  },
};
