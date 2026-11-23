import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  belarusPhoneValidator,
  hasSpecialCharValidator,
  hasUpperAndDigitValidator,
} from '../../../../validators/auth.validators';
import {
  TuiButton,
  TuiCheckbox,
  TuiErrorComponent,
  TuiErrorDirective,
  TuiIcon,
  TuiInputDirective,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { TuiButtonLoading, TuiInputPhone, TuiPassword } from '@taiga-ui/kit';
import { RegisterPayload } from '../../../../../core/models/auth.model';
import { toSignal } from '@angular/core/rxjs-interop';

interface PasswordRulesConfig {
  readonly label: string;
  readonly errorKey: string;
}

const PASSWORD_RULES_CONFIG: PasswordRulesConfig[] = [
  { label: '8+ симв.', errorKey: 'minlength' },
  { label: 'A-Z и 0-9', errorKey: 'upperAndDigit' },
  { label: '! @ # $ % _', errorKey: 'specialChar' },
];

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiButtonLoading,
    TuiErrorComponent,
    TuiErrorDirective,
    TuiIcon,
    TuiInputDirective,
    TuiPassword,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiInputPhone,
    TuiCheckbox,
  ],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isLoading = input<boolean>(false);
  readonly registerSubmitted = output<RegisterPayload>();
  readonly switchToLogin = output<void>();

  protected readonly form = this.fb.group({
    phone: ['', [Validators.required, belarusPhoneValidator()]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        hasUpperAndDigitValidator(),
        hasSpecialCharValidator(),
      ],
    ],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  private readonly passwordValue = toSignal(this.form.controls.password.valueChanges, {
    initialValue: '',
  });
  protected readonly passwordRules = computed(() => {
    const hasValue = this.passwordValue().length > 0;
    const control = this.form.controls.password;

    return PASSWORD_RULES_CONFIG.map((rule) => ({
      label: rule.label,
      valid: hasValue && !control.hasError(rule.errorKey),
    }));
  });

  protected onSubmit(): void {
    if (this.isLoading()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { acceptTerms, ...payload } = this.form.getRawValue();
    this.registerSubmitted.emit(payload);
  }
}
