import { mergeApplicationConfig, ApplicationConfig, signal } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { WA_ANIMATION_FRAME } from '@ng-web-apis/common';
import { EMPTY } from 'rxjs';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: TUI_DARK_MODE,
      useValue: signal(true),
    },
    {
      provide: WA_ANIMATION_FRAME,
      useValue: EMPTY,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

