import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AppConfig {
  production: boolean;
  environment: string;
  apiUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  enableDebugMode: boolean;
  enableMockData: boolean;
  retryAttempts: number;
  cacheTimeout: number;
  features: {
    enableAdvancedFilters: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableExport: boolean;
  };
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config: AppConfig = environment as AppConfig;

  get production(): boolean {
    return this.config.production;
  }

  get environment(): string {
    return this.config.environment;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get apiTimeout(): number {
    return this.config.apiTimeout;
  }

  get enableLogging(): boolean {
    return this.config.enableLogging;
  }

  get enableDebugMode(): boolean {
    return this.config.enableDebugMode;
  }

  get enableMockData(): boolean {
    return this.config.enableMockData;
  }

  get retryAttempts(): number {
    return this.config.retryAttempts;
  }

  get cacheTimeout(): number {
    return this.config.cacheTimeout;
  }

  get features() {
    return this.config.features;
  }

  get version(): string {
    return this.config.version;
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  log(message: string, data?: any): void {
    if (this.enableLogging) {
      if (data) {
        console.log(`[${this.environment.toUpperCase()}] ${message}`, data);
      } else {
        console.log(`[${this.environment.toUpperCase()}] ${message}`);
      }
    }
  }

  debug(message: string, data?: any): void {
    if (this.enableDebugMode) {
      if (data) {
        console.debug(`[${this.environment.toUpperCase()}] ${message}`, data);
      } else {
        console.debug(`[${this.environment.toUpperCase()}] ${message}`);
      }
    }
  }
}
