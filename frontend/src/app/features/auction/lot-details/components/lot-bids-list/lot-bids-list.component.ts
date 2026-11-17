import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MaskPipe } from '../../../../../shared/pipes/mask-pipe';
import { Bid, LotStatus } from '../../../../../core/models/lot.model';
import { TuiIcon } from '@taiga-ui/core';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { LOT_STATUS_CONFIG } from '../../../../../shared/config/lot-status.config';

@Component({
  selector: 'app-lot-bids-list',
  imports: [DatePipe, MaskPipe, TuiIcon, CurrencyComponent],
  standalone: true,
  templateUrl: './lot-bids-list.component.html',
  styleUrl: './lot-bids-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidsListComponent {
  readonly bids = input.required<readonly Bid[]>();
  readonly status = input.required<LotStatus>();

  protected readonly iconClass = computed<string>(() => LOT_STATUS_CONFIG[this.status()].textClass);
}
