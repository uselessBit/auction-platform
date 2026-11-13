import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LotStatus, lotStatus } from '../../../core/models/lot.model';

@Component({
  selector: 'app-lot-status-badge',
  imports: [],
  standalone: true,
  templateUrl: './lot-status-badge.component.html',
  styleUrl: './lot-status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotStatusBadgeComponent {
  readonly status = input.required<LotStatus>();

  protected readonly lotStatus = lotStatus;

  protected readonly badgeClass = computed(() => {
    switch (this.status()) {
      case 'active':
        return 'border-active bg-active-back text-active';
      case 'upcoming':
        return 'border-upcoming bg-upcoming-back text-upcoming';
      case 'finished':
        return 'border-finished bg-finished-back text-finished';
      case 'sold':
        return 'border-sold bg-sold-back text-sold';
      case 'cancelled':
        return 'border-cancelled bg-cancelled-back text-cancelled';
    }
  });
}
