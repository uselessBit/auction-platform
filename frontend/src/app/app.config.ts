import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideTaiga } from '@taiga-ui/core';
import { API_CONFIG } from './core/api/api-config.token';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'ru' },
    provideTaiga(),
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: 'https://api.secondrive.by/v1',
        wsUrl: 'wss://api.secondrive.by/ws',
        antiSniperExtendMinutes: 3,
      },
    },
  ],
};
