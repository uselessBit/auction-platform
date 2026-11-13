import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LotStatus } from '../../../core/models/lot.model';

@Component({
  selector: 'app-currency',
  imports: [DecimalPipe],
  standalone: true,
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
  readonly value = input.required<number>();
  readonly color = input<LotStatus>('active');

  protected readonly colorClass = computed(() => {
    switch (this.color()) {
      case 'upcoming':
        return 'text-upcoming';
      case 'finished':
        return 'text-finished';
      case 'sold':
        return 'text-sold';
      case 'cancelled':
        return 'text-cancelled';
      case 'active':
      default:
        return 'text-active';
    }
  });
}
