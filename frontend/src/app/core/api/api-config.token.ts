import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly wsUrl: string;
  readonly antiSniperExtendMinutes: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
