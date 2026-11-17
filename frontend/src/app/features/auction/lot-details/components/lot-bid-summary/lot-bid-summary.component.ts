import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import {
  ACTIVE_CATALOG_STATUSES,
  BID_HISTORY_STATUSES,
  BidStatusType,
  DATE_VISIBLE_STATUSES,
  LotDetails,
  LotStatus,
} from '../../../../../core/models/lot.model';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { BidStatusBadgeComponent } from '../../../../../shared/components/bid-status-badge/bid-status-badge.component';
import { LotTimerService } from '../../../../../core/services/lot-timer.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TuiIcon } from '@taiga-ui/core';
import { DatePipe } from '@angular/common';
import { MaskPipe } from '../../../../../shared/pipes/mask-pipe';
import { FinanceService } from '../../../../../core/services/finance.service';
import { resolveBidStatus } from '../../utils/bid-status.util';
import { LotAuctionRulesComponent } from '../lot-auction-rules/lot-auction-rules.component';
import { LOT_STATUS_CONFIG } from '../../../../../shared/config/lot-status.config';

interface BidSummaryConfig {
  readonly title: string;
  readonly subtitle: string;
}

const BID_SUMMARY_CONFIG: Readonly<Record<LotStatus, BidSummaryConfig>> = {
  upcoming: {
    title: 'Начальная цена',
    subtitle: 'до старта',
  },
  active: {
    title: 'Текущая ставка',
    subtitle: 'осталось',
  },
  finished: {
    title: 'Итоговая цена',
    subtitle: 'завершился',
  },
  sold: {
    title: 'Итоговая цена',
    subtitle: '-',
  },
  cancelled: {
    title: 'Последняя цена',
    subtitle: '-',
  },
};

@Component({
  selector: 'app-lot-bid-summary',
  imports: [
    CurrencyComponent,
    BidStatusBadgeComponent,
    TuiIcon,
    DatePipe,
    MaskPipe,
    LotAuctionRulesComponent,
  ],
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
  protected readonly statusConfig = computed(() => LOT_STATUS_CONFIG[this.lot().status]);
  protected readonly bidStatus = computed<BidStatusType>(() =>
    resolveBidStatus(
      this.lot(),
      this.authService.currentUser(),
      this.financeService.currentHolds(),
    ),
  );
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isLeaderCurrentUser = computed(() => {
    const user = this.authService.currentUser();
    const leaderBid = this.lot().bids[0];
    return !!user && !!leaderBid && leaderBid.userId === user.id;
  });

  protected readonly hasDateBlock = computed(() => DATE_VISIBLE_STATUSES.has(this.lot().status));
  protected readonly hasLeader = computed(
    () => BID_HISTORY_STATUSES.has(this.lot().status) && this.lot().bids.length > 0,
  );

  constructor() {
    effect(() => {
      const currentLot = this.lot();
      if (ACTIVE_CATALOG_STATUSES.has(currentLot.status)) {
        this.lotTimer.start(currentLot.endsAt);
      }
    });
  }
}
