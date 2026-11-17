import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import {
  ACTIVE_CATALOG_STATUSES,
  DATE_VISIBLE_STATUSES,
  Lot,
} from '../../../core/models/lot.model';
import { LotTimerService } from '../../../core/services/lot-timer.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CurrencyComponent } from '../currency/currency.component';
import { RouterLink } from '@angular/router';
import { LotStatusBadgeComponent } from '../lot-status-badge/lot-status-badge.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { TuiIcon } from '@taiga-ui/core';
import { LOT_STATUS_CONFIG } from '../../config/lot-status.config';

@Component({
  selector: 'app-lot-card',
  imports: [
    DecimalPipe,
    CurrencyComponent,
    DatePipe,
    RouterLink,
    LotStatusBadgeComponent,
    FavoriteButtonComponent,
    TuiIcon,
  ],
  standalone: true,
  providers: [LotTimerService],
  templateUrl: './lot-card.component.html',
  styleUrl: './lot-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotCardComponent {
  protected readonly lotTimer = inject(LotTimerService);

  readonly lot = input<Lot | null>(null);

  protected readonly hasDateBlock = computed(() => {
    const currentLot = this.lot();
    return !!currentLot && DATE_VISIBLE_STATUSES.has(currentLot.status);
  });
  protected readonly statusConfig = computed(() => {
    const currentLot = this.lot();
    return currentLot ? LOT_STATUS_CONFIG[currentLot.status] : null;
  });

  constructor() {
    effect(() => {
      const currentLot = this.lot();
      if (currentLot && ACTIVE_CATALOG_STATUSES.has(currentLot.status)) {
        this.lotTimer.start(currentLot.endsAt);
      }
    });
  }
}
