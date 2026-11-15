import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { BidStatusBadgeComponent } from '../../../../../shared/components/bid-status-badge/bid-status-badge.component';

@Component({
  selector: 'app-lot-bid-summary',
  imports: [CurrencyComponent, BidStatusBadgeComponent],
  standalone: true,
  templateUrl: './lot-bid-summary.component.html',
  styleUrl: './lot-bid-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidSummaryComponent {
  readonly lot = input.required<LotDetails>();
}
