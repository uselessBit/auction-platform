import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  belarusPhoneValidator,
  hasSpecialCharValidator,
  hasUpperAndDigitValidator,
} from '../../../../validators/auth.validators';

@Component({
  selector: 'app-register-form',
  imports: [],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    phone: ['', [Validators.required, belarusPhoneValidator()]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        hasUpperAndDigitValidator(),
        hasSpecialCharValidator(),
      ],
    ],
    acceptTerms: [false, [Validators.requiredTrue]],
  });
}
