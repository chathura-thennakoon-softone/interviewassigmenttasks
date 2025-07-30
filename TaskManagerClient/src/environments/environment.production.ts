export const environment = {
  production: true,
  environment: 'production',
  apiUrl: 'https://api.taskmanager.com/api',
  apiTimeout: 60000,
  enableLogging: false,
  enableDebugMode: false,
  enableMockData: false,
  retryAttempts: 3,
  cacheTimeout: 1800000, // 30 minutes
  features: {
    enableAdvancedFilters: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableExport: true
  },
  version: '1.0.0'
};
