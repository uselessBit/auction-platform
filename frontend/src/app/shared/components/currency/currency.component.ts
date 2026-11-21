import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LotStatus } from '../../../core/models/lot.model';
import { LOT_STATUS_CONFIG } from '../../config/lot-status.config';

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

  protected readonly colorClass = computed(() => LOT_STATUS_CONFIG[this.color()].textClass);
}
