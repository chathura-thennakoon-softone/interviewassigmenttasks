export const environment = {
  production: false,
  environment: 'qa',
  apiUrl: 'https://api-qa.taskmanager.com/api',
  apiTimeout: 45000,
  enableLogging: true,
  enableDebugMode: false,
  enableMockData: false,
  retryAttempts: 5,
  cacheTimeout: 600000, // 10 minutes
  features: {
    enableAdvancedFilters: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableExport: true
  },
  version: '1.0.0-qa'
};
