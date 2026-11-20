import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthModalService } from '../../../core/services/auth-modal.service';
import {
  TuiButton,
  TuiError,
  TuiIcon,
  TuiInput,
  TuiNotificationService,
  TuiPopups,
  TuiPopupService,
} from '@taiga-ui/core';
import { AuthService } from '../../../core/services/auth.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';

@Component({
  selector: 'app-auth-modal',
  imports: [
    TuiButton,
    ReactiveFormsModule,
    TuiInput,
    TuiIcon,
    TuiPassword,
    TuiButtonLoading,
    TuiError,
    TuiPopups,
  ],
  standalone: true,
  providers: [
    TuiPopupService,
    {
      provide: TuiNotificationService,
      useClass: TuiNotificationService,
      deps: [TuiPopupService],
    },
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly authService = inject(AuthService);
  private readonly authModal = inject(AuthModalService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(TuiNotificationService);
  private readonly globalNotifications = inject(TuiNotificationService, { skipSelf: true });

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly isClosing = signal<boolean>(false);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      if (this.authModal.isOpen() && !this.dialog().nativeElement.open) {
        this.open();
      }
      if (!this.authModal.isOpen() && this.dialog().nativeElement.open) {
        this.close();
      }
    });
  }

  protected open(): void {
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    if (this.isClosing()) {
      return;
    }
    this.isClosing.set(true);
  }

  protected onClose(): void {
    this.isClosing.set(false);
    this.authModal.close();
    this.form.reset();
  }

  protected onAnimationEnd(event: AnimationEvent): void {
    if (event.target === this.dialog().nativeElement && this.isClosing()) {
      this.dialog().nativeElement.close();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { email, password } = this.form.getRawValue();
    this.authService
      .login(email, password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (user) => {
          this.close();
          this.globalNotifications
            .open(`Вы вошли как ${user.email}`, {
              label: 'Успешный вход',
              appearance: 'positive',
              icon: '/assets/icons/check.svg',
              closable: false,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: (error: Error) =>
          this.notifications
            .open(error.message, {
              label: 'Ошибка входа',
              appearance: 'negative',
              icon: '/assets/icons/exclamation.svg',
              closable: false,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(),
      });
  }
}
