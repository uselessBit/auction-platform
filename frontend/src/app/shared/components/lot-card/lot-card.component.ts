import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Lot } from '../../../core/models/lot.model';
import { LotTimerService } from '../../../core/services/lot-timer.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CurrencyComponent } from '../currency/currency.component';
import { RouterLink } from '@angular/router';
import { LotStatusBadgeComponent } from '../lot-status-badge/lot-status-badge.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-lot-card',
  imports: [
    DecimalPipe,
    CurrencyComponent,
    DatePipe,
    RouterLink,
    LotStatusBadgeComponent,
    FavoriteButtonComponent,
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

  constructor() {
    effect(() => {
      const currentLot = this.lot();
      if (currentLot && (currentLot.status === 'active' || currentLot.status === 'upcoming')) {
        this.lotTimer.start(currentLot.endsAt);
      }
    });
  }

  protected readonly titleHoverClass = computed(() => {
    switch (this.lot()?.status) {
      case 'upcoming':
        return 'group-hover:text-upcoming';
      case 'finished':
        return 'group-hover:text-finished';
      case 'sold':
        return 'group-hover:text-sold';
      case 'cancelled':
        return 'group-hover:text-cancelled';
      case 'active':
      default:
        return 'group-hover:text-active';
    }
  });
}
