import { EnvironmentProviders, makeEnvironmentProviders, signal } from '@angular/core';
import { TUI_DEFAULT_LANGUAGE } from '@taiga-ui/i18n/tokens';
import { TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n/languages/russian';
import {
  TUI_PASSWORD_TEXTS,
  tuiInputPhoneOptionsProvider,
  tuiPasswordOptionsProvider,
} from '@taiga-ui/kit';
import {
  provideTaiga,
  tuiCheckboxOptionsProvider,
  tuiCommonIconsProvider,
  tuiValidationErrorsProvider,
} from '@taiga-ui/core';

export function provideAppTaiga(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTaiga(),
    {
      provide: TUI_DEFAULT_LANGUAGE,
      useValue: TUI_RUSSIAN_LANGUAGE,
    },
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: signal(['', '']),
    },
    tuiPasswordOptionsProvider({
      icons: {
        show: '/assets/icons/eye.svg',
        hide: '/assets/icons/eye-crossed.svg',
      },
    }),
    tuiCommonIconsProvider({
      close: '/assets/icons/x.svg',
    }),
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      email: 'Некорректный формат email',
      minlength: ({ requiredLength }: { requiredLength: number }) =>
        `Минимум ${requiredLength} символов`,
      min: ({ min }: { min: number }) => `Минимальное значение: ${min}`,
      belarusPhone: 'Некорректный номер телефона',
      upperAndDigit: 'Должен содержать заглавную букву и цифру',
      specialChar: 'Должен содержать спецсимвол (! @ # $ % _)',
    }),
    tuiInputPhoneOptionsProvider({ mask: '+375 (##) ###-##-##' }),
    tuiCheckboxOptionsProvider({
      icons: { checked: () => '/assets/icons/check.svg', indeterminate: () => '' },
    }),
  ]);
}
