import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { TUI_DEFAULT_LANGUAGE } from '@taiga-ui/i18n/tokens';
import { TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n/languages/russian';
import { tuiPasswordOptionsProvider } from '@taiga-ui/kit';
import { provideTaiga, tuiValidationErrorsProvider } from '@taiga-ui/core';

export function provideAppTaiga(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTaiga(),
    {
      provide: TUI_DEFAULT_LANGUAGE,
      useValue: TUI_RUSSIAN_LANGUAGE,
    },
    tuiPasswordOptionsProvider({
      icons: {
        show: '/assets/icons/eye.svg',
        hide: '/assets/icons/eye-crossed.svg',
      },
    }),
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      email: 'Некорректный формат email',
      minlength: ({ requiredLength }: { requiredLength: number }) =>
        `Минимум ${requiredLength} символов`,
    }),
  ]);
}
