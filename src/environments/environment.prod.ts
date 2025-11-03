export const environment = {
  production: true,
  apiUrl: 'https://api.production-domain.com/api',
  apiTimeout: 30000,
  features: {
    realTimeUpdates: true,
    analytics: true,
    darkMode: true
  },
  refreshInterval: {
    projects: 5000,
    stats: 10000
  },
  storage: {
    type: 'indexedDB',
    version: 1
  }
};
