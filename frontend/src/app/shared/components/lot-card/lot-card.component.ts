import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
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
  providers: [LotTimerService],
  templateUrl: './lot-card.component.html',
  styleUrl: './lot-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotCardComponent implements OnInit {
  readonly lot = input.required<Lot>();

  readonly lotTimer = inject(LotTimerService);

  ngOnInit() {
    if (this.lot().status === 'active' || this.lot().status === 'upcoming') {
      this.lotTimer.start(this.lot().endsAt);
    }
  }
}
