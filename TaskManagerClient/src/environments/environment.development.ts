export const environment = {
  production: false,
  environment: 'development',
  apiUrl: 'https://localhost:7196/api',
  apiTimeout: 30000,
  enableLogging: true,
  enableDebugMode: true,
  enableMockData: false,
  retryAttempts: 3,
  cacheTimeout: 300000, // 5 minutes
  features: {
    enableAdvancedFilters: true,
    enableNotifications: true,
    enableAnalytics: false,
    enableExport: true
  },
  version: '1.0.0-dev'
};
