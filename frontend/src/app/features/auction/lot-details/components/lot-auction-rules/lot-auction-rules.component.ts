import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { LotStatus } from '../../../../../core/models/lot.model';

@Component({
  selector: 'app-lot-auction-rules',
  imports: [CurrencyComponent],
  templateUrl: './lot-auction-rules.component.html',
  styleUrl: './lot-auction-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotAuctionRulesComponent {
  readonly bidStepByn = input.required<number>();
  readonly startPriceByn = input.required<number>();
  readonly color = input<LotStatus>('active');
}
