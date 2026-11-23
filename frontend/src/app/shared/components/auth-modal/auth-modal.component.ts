import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuthModalService } from '../../../core/services/auth-modal.service';
import { TuiButton, TuiNotificationService, TuiPopups, TuiPopupService } from '@taiga-ui/core';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { VerifyCodesFormComponent } from './components/verify-codes-form/verify-codes-form.component';
import { AuthModalMode, LoginPayload } from '../../../core/models/auth.model';

const TITLE_CONFIG: Readonly<Record<AuthModalMode, string>> = {
  login: 'Вход в аккаунт',
  register: 'Создание аккаунта',
  verify: 'Подтверждение',
};

@Component({
  selector: 'app-auth-modal',
  imports: [
    TuiPopups,
    LoginFormComponent,
    RegisterFormComponent,
    VerifyCodesFormComponent,
    TuiButton,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(TuiNotificationService);
  private readonly globalNotifications = inject(TuiNotificationService, { skipSelf: true });

  protected readonly mode = this.authModal.mode;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly isClosing = signal<boolean>(false);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isOpen = signal<boolean>(false);

  protected switchMode(mode: AuthModalMode): void {
    this.authModal.setMode(mode);
  }

  protected readonly title = computed(() => TITLE_CONFIG[this.mode()]);

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
    this.isOpen.set(true);
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
    this.isOpen.set(false);
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

  protected onBackdropMousedown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      event.preventDefault();
    }
  }

  protected onLogin(payload: LoginPayload): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.authService
      .login(payload)
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
