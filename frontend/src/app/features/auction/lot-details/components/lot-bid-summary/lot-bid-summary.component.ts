import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BidStatusType, LotDetails, LotStatus } from '../../../../../core/models/lot.model';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { BidStatusBadgeComponent } from '../../../../../shared/components/bid-status-badge/bid-status-badge.component';
import { LotTimerService } from '../../../../../core/services/lot-timer.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TuiIcon } from '@taiga-ui/core';
import { DatePipe } from '@angular/common';
import { KycStatus } from '../../../../../core/models/auth.model';
import { MaskPipe } from '../../../../../shared/pipes/mask-pipe';
import { FinanceService } from '../../../../../core/services/finance.service';

interface BidSummaryConfig {
  readonly text: string;
  readonly container: string;
  readonly title: string;
  readonly subtitle: string;
}

const BID_SUMMARY_CONFIG: Readonly<Record<LotStatus, BidSummaryConfig>> = {
  upcoming: {
    text: 'text-upcoming',
    container: 'bg-upcoming-back border-upcoming',
    title: 'Начальная цена',
    subtitle: 'до старта',
  },
  active: {
    text: 'text-active',
    container: 'bg-active-back border-active',
    title: 'Текущая ставка',
    subtitle: 'осталось',
  },
  finished: {
    text: 'text-finished',
    container: 'bg-finished-back border-finished',
    title: 'Итоговая цена',
    subtitle: 'завершился',
  },
  sold: {
    text: 'text-sold',
    container: 'bg-sold-back border-sold',
    title: 'Итоговая цена',
    subtitle: '-',
  },
  cancelled: {
    text: 'text-cancelled',
    container: 'bg-cancelled-back border-cancelled',
    title: 'Последняя цена',
    subtitle: '-',
  },
};

const BID_STATUS_CONFIG: Readonly<Record<Exclude<LotStatus, 'active'>, BidStatusType>> = {
  upcoming: 'awaiting_start',
  finished: 'awaiting_payment',
  sold: 'deal_closed',
  cancelled: 'auction_cancelled',
};

const KYC_STATUS_CONFIG: Readonly<Record<Exclude<KycStatus, 'approved'>, BidStatusType>> = {
  none: 'kyc_required',
  rejected: 'kyc_required',
  pending: 'kyc_pending',
};

@Component({
  selector: 'app-lot-bid-summary',
  imports: [CurrencyComponent, BidStatusBadgeComponent, TuiIcon, DatePipe, MaskPipe],
  providers: [LotTimerService],
  standalone: true,
  templateUrl: './lot-bid-summary.component.html',
  styleUrl: './lot-bid-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidSummaryComponent {
  protected readonly lotTimer = inject(LotTimerService);
  private readonly authService = inject(AuthService);
  private readonly financeService = inject(FinanceService);

  readonly lot = input.required<LotDetails>();

  protected readonly timerConfig = computed<BidSummaryConfig>(
    () => BID_SUMMARY_CONFIG[this.lot().status],
  );
  protected readonly bidStatus = computed<BidStatusType>(() => {
    const status = this.lot().status;
    if (status !== 'active') {
      return BID_STATUS_CONFIG[status];
    }

    const user = this.authService.currentUser();
    if (!user) {
      return 'auth_required';
    }
    if (!user.isPhoneVerified || !user.isEmailVerified) {
      return 'contacts_unverified';
    }
    if (user.kycStatus !== 'approved') {
      return KYC_STATUS_CONFIG[user.kycStatus];
    }

    const holds = this.financeService.currentHolds();
    if (
      !holds.some(
        (hold) =>
          hold.lotId === this.lot().id && hold.userId === user.id && hold.status === 'pre_auth',
      )
    ) {
      return 'deposit_required';
    }

    const bids = this.lot().bids;
    if (!bids.some((bid) => bid.isMyBid)) {
      return 'no_bids';
    }
    if (bids[0].isMyBid) {
      return 'leading';
    }
    return 'outbid';
  });

  constructor() {
    effect(() => {
      const currentLot = this.lot();
      if (currentLot.status === 'active' || currentLot.status === 'upcoming') {
        this.lotTimer.start(currentLot.endsAt);
      }
    });
  }
}
