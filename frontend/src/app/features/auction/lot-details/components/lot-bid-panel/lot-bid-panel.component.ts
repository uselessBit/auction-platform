import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { BidStatusType, BlockedBidStatus, LotDetails } from '../../../../../core/models/lot.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { FinanceService } from '../../../../../core/services/finance.service';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TuiInputNumber } from '@taiga-ui/kit';
import { toSignal } from '@angular/core/rxjs-interop';
import { resolveBidStatus } from '../../utils/bid-status.util';
import { LotAuctionRulesComponent } from '../lot-auction-rules/lot-auction-rules.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LotBidProgressComponent } from '../lot-bid-progress/lot-bid-progress.component';

interface QuickBidConfig {
  readonly label: string;
  readonly steps: number;
}

const QUICK_BID_CONFIG: readonly QuickBidConfig[] = [
  { label: 'Минимальный шаг', steps: 1 },
  { label: 'Два шага', steps: 2 },
  { label: 'Пять шагов', steps: 5 },
  { label: 'Десять шагов', steps: 10 },
];

interface BlockedBidConfig {
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly hint: string;
  readonly icon?: string;
  readonly iconClass?: string;
  readonly stepLabel: string;
  readonly stepLabelClass?: string;
}

const BLOCKED_BID_CONFIG: Readonly<Record<BlockedBidStatus, BlockedBidConfig>> = {
  deposit_required: {
    title: 'Гарантийный депозит',
    description: 'Для участия в торгах необходимо заморозить 10% от стартовой цены лота.',
    actionLabel: 'Внести депозит',
    hint: 'В случае проигрыша ваши средства разморозятся',
    stepLabel: 'Финальный шаг (4 из 4)',
    stepLabelClass: 'text-active',
  },
  kyc_required: {
    title: 'Требуется верификация',
    description:
      'По законодательству РБ для участия в торгах нужно подтвердить личность паспортом.',
    actionLabel: 'Пройти верификацию (KYC)',
    hint: 'После ваши фото автоматически удаляются с сервера',
    icon: '/assets/icons/shield-check.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 3 из 4',
    stepLabelClass: 'opacity-50',
  },
  kyc_pending: {
    title: 'Проверяем документы',
    description:
      'Модератор сверяет анкету. Как только профиль подтвердят, откроется внесение депозита.',
    actionLabel: 'Документы на проверке (15 - 30 минут)',
    hint: 'Пришлем SMS-уведомление сразу после одобрения',
    icon: '/assets/icons/time-forward.svg',
    iconClass: 'text-upcoming bg-upcoming-back border-upcoming',
    stepLabel: 'Проверка KYC...',
    stepLabelClass: 'text-upcoming',
  },
  auth_required: {
    title: 'Требуется авторизация',
    description: 'Войдите в аккаунт, чтобы увидеть полный VIN-код автомобиля и делать ставки.',
    actionLabel: 'Войти / Регистрация',
    hint: 'Если нет аккаунта, регистрация займет 1 минуту',
    icon: '/assets/icons/lock.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 1 из 4',
    stepLabelClass: 'opacity-50',
  },
  contacts_unverified: {
    title: 'Подтвердите контакты',
    description: 'Для перехода к верификации профиля необходимо подтвердить телефон и почту.',
    actionLabel: 'Подтвердить контакты',
    hint: 'Остался всего один шаг до верификации профиля',
    icon: '/assets/icons/envelope.svg',
    iconClass: 'text-active bg-active-back border-active',
    stepLabel: 'Допуск: Шаг 2 из 4',
    stepLabelClass: 'opacity-50',
  },
};

type ConfirmDialog = 'bid' | 'deposit';

interface ConfirmDialogConfig {
  readonly title: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
}

const CONFIRM_DIALOG_CONFIG: Readonly<Record<ConfirmDialog, ConfirmDialogConfig>> = {
  bid: {
    title: 'Подтверждение ставки',
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
  },
  deposit: {
    title: 'Подтверждение депозита',
    confirmLabel: 'Перейти в банк',
    cancelLabel: 'Отмена',
  },
};

@Component({
  selector: 'app-lot-bid-panel',
  imports: [
    CurrencyComponent,
    TuiButton,
    ReactiveFormsModule,
    DecimalPipe,
    TuiInputNumber,
    TuiIcon,
    LotAuctionRulesComponent,
    ConfirmDialogComponent,
    FormsModule,
    LotBidProgressComponent,
  ],
  standalone: true,
  templateUrl: './lot-bid-panel.component.html',
  styleUrl: './lot-bid-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidPanelComponent {
  private readonly authService = inject(AuthService);
  private readonly financeService = inject(FinanceService);

  readonly lot = input.required<LotDetails>();
  readonly bidSubmit = output<number>();
  readonly blockedAction = output<BlockedBidStatus>();

  protected readonly quickBids = computed(() =>
    QUICK_BID_CONFIG.map((bid) => ({
      label: bid.label,
      amount: bid.steps * this.lot().bidStepByn,
    })),
  );
  protected readonly minBid = computed(() => this.lot().currentBidByn + this.lot().bidStepByn);
  protected readonly amountControl = new FormControl<number | null>(null, [Validators.required]);
  protected readonly depositAmount = computed(() => Math.round(this.lot().startPriceByn * 0.1));

  private readonly amountStatus = toSignal(this.amountControl.statusChanges, {
    initialValue: this.amountControl.status,
  });
  protected readonly isSubmitDisabled = computed(() => this.amountStatus() !== 'VALID');

  protected readonly bidStatus = computed<BidStatusType>(() =>
    resolveBidStatus(
      this.lot(),
      this.authService.currentUser(),
      this.financeService.currentHolds(),
    ),
  );
  protected readonly canBid = computed(
    () =>
      this.bidStatus() === 'no_bids' ||
      this.bidStatus() === 'leading' ||
      this.bidStatus() === 'outbid',
  );
  protected readonly blockedState = computed<{
    status: BlockedBidStatus;
    config: BlockedBidConfig;
  } | null>(() => {
    const status = this.bidStatus();
    return this.isBlockedStatus(status) ? { status, config: BLOCKED_BID_CONFIG[status] } : null;
  });

  private isBlockedStatus(status: BidStatusType): status is BlockedBidStatus {
    return status in BLOCKED_BID_CONFIG;
  }
  protected readonly pendingAction = signal<{ type: ConfirmDialog; amount: number } | null>(null);
  protected readonly dialogConfig = computed(() => {
    const action = this.pendingAction();
    return action ? CONFIRM_DIALOG_CONFIG[action.type] : null;
  });
  private readonly confirmDialog = viewChild.required(ConfirmDialogComponent);

  constructor() {
    effect(() => {
      this.amountControl.setValidators([Validators.required, Validators.min(this.minBid())]);
      this.amountControl.updateValueAndValidity();
    });
  }

  protected onCustomBid(): void {
    if (this.amountControl.invalid || this.amountControl.value === null) {
      return;
    }

    this.pendingAction.set({ type: 'bid', amount: this.amountControl.value });
    this.confirmDialog().open();
  }

  protected onQuickBid(value: number): void {
    this.pendingAction.set({ type: 'bid', amount: this.lot().currentBidByn + value });
    this.confirmDialog().open();
  }

  protected onBlockedAction(): void {
    const status = this.bidStatus();
    if (!this.isBlockedStatus(status) || status === 'kyc_pending') {
      return;
    }

    if (status === 'deposit_required') {
      this.pendingAction.set({ type: 'deposit', amount: this.depositAmount() });
      this.confirmDialog().open();
    } else {
      this.blockedAction.emit(status);
    }
  }

  protected onDialogConfirm(): void {
    const action = this.pendingAction();
    if (!action) {
      return;
    }

    if (action.type === 'bid') {
      this.bidSubmit.emit(action.amount);
      this.amountControl.reset();
    }
    if (action.type === 'deposit') {
      this.blockedAction.emit('deposit_required');
    }
  }

  protected onDialogClosed(): void {
    this.pendingAction.set(null);
  }
}
