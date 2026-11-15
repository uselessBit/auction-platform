import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MaskPipe } from '../../../../../shared/pipes/mask-pipe';
import { Bid, LotStatus } from '../../../../../core/models/lot.model';
import { TuiIcon } from '@taiga-ui/core';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';

const ICON_COLOR_CONFIG: Readonly<Record<LotStatus, string>> = {
  active: 'text-active',
  finished: 'text-finished',
  sold: 'text-sold',
  cancelled: 'text-cancelled',
  upcoming: 'text-upcoming',
};

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

  protected readonly iconClass = computed<string>(() => ICON_COLOR_CONFIG[this.status()]);
}
