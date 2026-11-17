import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LotStatus } from '../../../core/models/lot.model';
import { TuiIcon } from '@taiga-ui/core';
import { LOT_STATUS_CONFIG } from '../../config/lot-status.config';

@Component({
  selector: 'app-lot-status-badge',
  imports: [TuiIcon],
  standalone: true,
  templateUrl: './lot-status-badge.component.html',
  styleUrl: './lot-status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotStatusBadgeComponent {
  readonly status = input.required<LotStatus>();

  protected readonly lotStatus = computed(() => LOT_STATUS_CONFIG[this.status()].label);
  protected readonly badgeClass = computed(() => LOT_STATUS_CONFIG[this.status()].badgeClass);
}
