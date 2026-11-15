import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BidStatusType, LotDetails, LotStatus } from '../../../../../core/models/lot.model';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { BidStatusBadgeComponent } from '../../../../../shared/components/bid-status-badge/bid-status-badge.component';
import { LotTimerService } from '../../../../../core/services/lot-timer.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TuiIcon } from '@taiga-ui/core';
import { DatePipe } from '@angular/common';
import { MaskPipe } from '../../../../../shared/pipes/mask-pipe';
import { FinanceService } from '../../../../../core/services/finance.service';
import { resolveBidStatus } from '../../utils/bid-status.util';

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
  protected readonly bidStatus = computed<BidStatusType>(() =>
    resolveBidStatus(
      this.lot(),
      this.authService.currentUser(),
      this.financeService.currentHolds(),
    ),
  );

  constructor() {
    effect(() => {
      const currentLot = this.lot();
      if (currentLot.status === 'active' || currentLot.status === 'upcoming') {
        this.lotTimer.start(currentLot.endsAt);
      }
    });
  }
}
