import { mergeApplicationConfig, ApplicationConfig, signal } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { TUI_DARK_MODE } from '@taiga-ui/core';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: TUI_DARK_MODE,
      useValue: signal(true),
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
