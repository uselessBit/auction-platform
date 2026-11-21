import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  BidStatusType,
  BLOCKED_BID_STATUSES,
  BlockedBidStatus,
  LotDetails,
} from '../../../../../core/models/lot.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { FinanceService } from '../../../../../core/services/finance.service';
import { DecimalPipe } from '@angular/common';
import { resolveBidStatus } from '../../utils/bid-status.util';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LotBidFormComponent } from '../lot-bid-form/lot-bid-form.component';
import { LotBidBlockedComponent } from '../lot-bid-blocked/lot-bid-blocked.component';

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
  imports: [DecimalPipe, ConfirmDialogComponent, LotBidFormComponent, LotBidBlockedComponent],
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

  protected readonly depositAmount = computed(() => Math.round(this.lot().startPriceByn * 0.1));

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
  protected readonly blockedStatus = computed<BlockedBidStatus | null>(() => {
    const status = this.bidStatus();
    return this.isBlockedStatus(status) ? status : null;
  });

  private isBlockedStatus(status: BidStatusType): status is BlockedBidStatus {
    return BLOCKED_BID_STATUSES.has(status);
  }
  protected readonly pendingAction = signal<{ type: ConfirmDialog; amount: number } | null>(null);
  protected readonly dialogConfig = computed(() => {
    const action = this.pendingAction();
    return action ? CONFIRM_DIALOG_CONFIG[action.type] : null;
  });
  private readonly confirmDialog = viewChild.required(ConfirmDialogComponent);
  private readonly bidForm = viewChild(LotBidFormComponent);

  protected onBidRequested(amount: number): void {
    this.pendingAction.set({ type: 'bid', amount });
    this.confirmDialog().open();
  }

  protected onBlockedAction(status: BlockedBidStatus): void {
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
      this.bidForm()?.resetCustomBid();
    }
    if (action.type === 'deposit') {
      this.blockedAction.emit('deposit_required');
    }
  }

  protected onDialogClosed(): void {
    this.pendingAction.set(null);
  }
}
