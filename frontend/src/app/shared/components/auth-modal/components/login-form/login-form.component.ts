import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginPayload } from '../../../../../core/models/auth.model';
import { TuiButton, TuiError, TuiIcon, TuiInput } from '@taiga-ui/core';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    TuiInput,
    TuiError,
    TuiIcon,
    TuiPassword,
    TuiButton,
    TuiButtonLoading,
  ],
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isLoading = input<boolean>(false);
  readonly loginSubmitted = output<LoginPayload>();
  readonly switchToRegister = output<void>();

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected onSubmit(): void {
    if (this.isLoading()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginSubmitted.emit(this.form.getRawValue());
  }
}
