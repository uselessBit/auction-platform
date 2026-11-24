import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiErrorComponent, TuiErrorDirective } from '@taiga-ui/core';
import { TuiButtonLoading, TuiInputPin } from '@taiga-ui/kit';
import { PhonePipe } from '../../../../pipes/phone-pipe';
import { VerifyCodesFieldErrors, VerifyCodesPayload } from '../../../../../core/models/auth.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-verify-codes-form',
  imports: [
    TuiInputPin,
    ReactiveFormsModule,
    TuiButton,
    TuiErrorComponent,
    TuiErrorDirective,
    TuiButtonLoading,
    PhonePipe,
  ],
  standalone: true,
  templateUrl: './verify-codes-form.component.html',
  styleUrl: './verify-codes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyCodesFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isLoading = input<boolean>(false);
  readonly email = input<string>('');
  readonly phone = input<string>('');
  readonly fieldErrors = input<VerifyCodesFieldErrors | null>(null);
  readonly verifySubmitted = output<VerifyCodesPayload>();
  readonly closeModal = output<void>();

  protected readonly form = this.fb.group({
    smsCode: ['', [Validators.required, Validators.minLength(4)]],
    emailCode: ['', [Validators.required, Validators.minLength(4)]],
  });

  protected readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });
  protected readonly canSubmit = computed(() => this.formStatus() === 'VALID');

  constructor() {
    effect(() => {
      const errors = this.fieldErrors();

      if (errors?.smsInvalid) {
        this.form.controls.smsCode.setErrors({ invalidCode: true });
        this.form.controls.smsCode.markAsTouched();
      }
      if (errors?.emailInvalid) {
        this.form.controls.emailCode.setErrors({ invalidCode: true });
        this.form.controls.emailCode.markAsTouched();
      }
    });
  }

  protected onSubmit(): void {
    if (this.isLoading()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.verifySubmitted.emit(this.form.getRawValue());
  }
}
