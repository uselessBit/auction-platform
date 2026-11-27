import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  Signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiErrorComponent, TuiErrorDirective, TuiInput } from '@taiga-ui/core';
import { TuiButtonLoading, TuiInputPhoneDirective, TuiInputPin } from '@taiga-ui/kit';
import { PhonePipe } from '../../../../pipes/phone-pipe';
import {
  UpdateContactPayload,
  VerificationChannel,
  VerifyCodesFieldErrors,
  VerifyCodesPayload,
} from '../../../../../core/models/auth.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, of, startWith, Subject, switchMap, take, timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { belarusPhoneValidator } from '../../../../validators/auth.validators';

const RESEND_COOLDOWN_SECONDS = 59;

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
    TuiInput,
    TuiInputPhoneDirective,
  ],
  standalone: true,
  templateUrl: './verify-codes-form.component.html',
  styleUrl: './verify-codes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyCodesFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isLoading = input<boolean>(false);
  readonly isUpdatingContact = input<boolean>(false);
  readonly email = input<string>('');
  readonly phone = input<string>('');
  readonly fieldErrors = input<VerifyCodesFieldErrors | null>(null);
  readonly verifySubmitted = output<VerifyCodesPayload>();
  readonly closeModal = output<void>();
  readonly resendRequested = output<VerificationChannel>();
  readonly contactChanged = output<UpdateContactPayload>();

  protected readonly form = this.fb.group({
    smsCode: ['', [Validators.required, Validators.minLength(4)]],
    emailCode: ['', [Validators.required, Validators.minLength(4)]],
  });
  protected readonly editEmailControl = this.fb.control('', [
    Validators.required,
    Validators.email,
  ]);
  protected readonly editPhoneControl = this.fb.control('', [
    Validators.required,
    belarusPhoneValidator(),
  ]);

  protected readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });
  protected readonly canSubmit = computed(
    () => this.formStatus() === 'VALID' && this.editingChannel() === null,
  );

  private readonly emailResend$ = new Subject<void>();
  private readonly smsResend$ = new Subject<void>();
  protected readonly emailCooldown = this.createCooldownSignal(this.emailResend$);
  protected readonly smsCooldown = this.createCooldownSignal(this.smsResend$);

  protected readonly editingChannel = signal<VerificationChannel | null>(null);

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

  private createCooldownSignal(trigger$: Observable<void>): Signal<number> {
    const countdown$ = trigger$.pipe(
      startWith(undefined),
      switchMap(() => {
        if (!this.isBrowser) {
          return of(0);
        }

        return timer(0, 1000).pipe(
          map((tick) => RESEND_COOLDOWN_SECONDS - tick),
          take(RESEND_COOLDOWN_SECONDS + 1),
        );
      }),
    );

    return toSignal(countdown$, { initialValue: 0 });
  }

  protected onResend(channel: VerificationChannel): void {
    if (channel === 'email') {
      this.emailResend$.next();
    }
    if (channel === 'phone') {
      this.smsResend$.next();
    }

    this.resendRequested.emit(channel);
  }

  protected formatCooldown(seconds: number): string {
    return seconds < 10 ? `0:0${seconds}` : `0:${seconds}`;
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

  protected startEdit(channel: VerificationChannel): void {
    if (channel === 'email') {
      this.editEmailControl.setValue(this.email());
      this.editEmailControl.markAsUntouched();
    }
    if (channel === 'phone') {
      this.editPhoneControl.setValue(this.phone());
      this.editPhoneControl.markAsUntouched();
    }

    this.editingChannel.set(channel);
  }

  protected cancelEdit(): void {
    this.editingChannel.set(null);
  }

  protected saveContact(channel: VerificationChannel): void {
    if (this.isUpdatingContact()) {
      return;
    }

    const cooldown = channel === 'email' ? this.emailCooldown() : this.smsCooldown();
    if (cooldown > 0) {
      return;
    }

    const control = channel === 'email' ? this.editEmailControl : this.editPhoneControl;

    if (control.invalid) {
      control.markAsTouched();
      return;
    }

    this.contactChanged.emit({ channel, value: control.getRawValue() });
  }

  completeContactEdit(channel: VerificationChannel): void {
    this.editingChannel.set(null);

    if (channel === 'email') {
      this.form.controls.emailCode.reset();
      this.emailResend$.next();
    }
    if (channel === 'phone') {
      this.form.controls.smsCode.reset();
      this.smsResend$.next();
    }
  }
}
