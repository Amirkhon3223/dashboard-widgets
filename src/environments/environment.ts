export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
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
    type: 'localStorage',
    version: 1
  }
};
