import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BlockedBidStatus } from '../../../../../core/models/lot.model';

const STATUS_STEP_INDEX: Readonly<Record<BlockedBidStatus, number>> = {
  auth_required: 1,
  contacts_unverified: 2,
  kyc_required: 3,
  kyc_pending: 3,
  deposit_required: 4,
};

@Component({
  selector: 'app-lot-bid-progress',
  imports: [],
  standalone: true,
  templateUrl: './lot-bid-progress.component.html',
  styleUrl: './lot-bid-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidProgressComponent {
  readonly status = input.required<BlockedBidStatus>();

  private readonly TOTAL_STEPS: number = 4;
  protected readonly segments = computed<string[]>(() => {
    const classes = [];
    const statusId = STATUS_STEP_INDEX[this.status()];

    for (let i = 1; i <= this.TOTAL_STEPS; i++) {
      if (i === statusId && this.status() === 'kyc_pending') {
        classes.push('bg-upcoming animate-pulse');
      } else if (i <= statusId) {
        classes.push('bg-active');
      } else {
        classes.push('bg-stroke');
      }
    }
    return classes;
  });
}
