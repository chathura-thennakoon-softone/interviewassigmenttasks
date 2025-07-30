# Environment Configuration Guide

This document explains how to configure and deploy the Task Manager application across different environments.

## Environment Profiles

### 🔧 Development Environment
- **File**: `src/environments/environment.development.ts`
- **API URL**: `https://localhost:7196/api` (Local development server)
- **Features**: Full debugging, logging enabled, mock data available
- **Usage**: `npm run start:dev` or `npm run build:dev`

### 🧪 QA Environment
- **File**: `src/environments/environment.qa.ts`
- **API URL**: `https://api-qa.taskmanager.com/api` (QA server)
- **Features**: Analytics enabled, reduced logging, optimized builds
- **Usage**: `npm run start:qa` or `npm run build:qa`

### 🚀 Production Environment
- **File**: `src/environments/environment.production.ts`
- **API URL**: `https://api.taskmanager.com/api` (Production server)
- **Features**: No debugging, no logging, fully optimized
- **Usage**: `npm run start:prod` or `npm run build:prod`

## Configuration Properties

| Property | Development | QA | Production | Description |
|----------|-------------|----|-----------:|-------------|
| `production` | false | false | true | Production mode flag |
| `apiUrl` | localhost:7196 | api-qa.domain | api.domain | API endpoint URL |
| `apiTimeout` | 30s | 45s | 60s | HTTP request timeout |
| `enableLogging` | true | true | false | Console logging |
| `enableDebugMode` | true | false | false | Debug information |
| `retryAttempts` | 3 | 5 | 3 | API retry attempts |
| `cacheTimeout` | 5min | 10min | 30min | Cache duration |

## Available Scripts

### Development
```bash
npm run start:dev    # Serve with development config
npm run build:dev    # Build with development config
```

### QA
```bash
npm run start:qa     # Serve with QA config
npm run build:qa     # Build with QA config
```

### Production
```bash
npm run start:prod   # Serve with production config
npm run build:prod   # Build with production config
```

### Build Scripts
```bash
# Windows
scripts\build.bat [dev|qa|prod]

# Linux/Mac
scripts/build.sh [dev|qa|prod]
```

## Feature Flags

The application supports feature flags that can be enabled/disabled per environment:

```typescript
features: {
  enableAdvancedFilters: boolean;  // Advanced task filtering
  enableNotifications: boolean;    // Push notifications
  enableAnalytics: boolean;        // Usage analytics
  enableExport: boolean;          // Data export functionality
}
```

## Environment Service Usage

Use the `EnvironmentService` in your components:

```typescript
import { EnvironmentService } from './services/environment.service';

constructor(private envService: EnvironmentService) {}

ngOnInit() {
  // Check if feature is enabled
  if (this.envService.isFeatureEnabled('enableAnalytics')) {
    // Initialize analytics
  }
  
  // Log with environment prefix
  this.envService.log('Component initialized');
  
  // Get configuration
  const config = this.envService.getConfig();
}
```

## Deployment Checklist

### Development Deployment
- [ ] Update API URL to development server
- [ ] Enable all debugging features
- [ ] Test all functionality
- [ ] Verify console logs work

### QA Deployment
- [ ] Update API URL to QA server
- [ ] Enable analytics for testing
- [ ] Disable debug mode
- [ ] Test with QA data
- [ ] Verify performance metrics

### Production Deployment
- [ ] Update API URL to production server
- [ ] Disable all logging and debugging
- [ ] Enable all production features
- [ ] Optimize bundle size
- [ ] Test in production-like environment
- [ ] Verify security headers
- [ ] Test error handling

## Environment Variables

You can override certain configurations using environment variables:

```bash
# Set API URL
export API_URL=https://custom-api.domain.com/api

# Set environment name
export APP_ENV=staging
```

## Troubleshooting

### Common Issues

1. **API URL not updating**: Clear browser cache and rebuild
2. **Features not working**: Check feature flags in environment file
3. **Build errors**: Verify all environment files have matching structure
4. **Logging not working**: Check `enableLogging` flag in environment

### Debug Mode

Enable debug mode in development to see detailed information:

```typescript
// In environment.development.ts
enableDebugMode: true
```

This will show:
- API request/response details
- Component lifecycle events
- State changes
- Error stack traces

## Security Considerations

### Development
- API keys and secrets should not be committed
- Use placeholder values for sensitive data
- Local SSL certificates for HTTPS testing

### QA
- Use separate API keys from production
- Sanitized test data only
- Monitor for data leaks

### Production
- No debug information exposed
- Secure API endpoints
- No console logging
- Minified and obfuscated code
