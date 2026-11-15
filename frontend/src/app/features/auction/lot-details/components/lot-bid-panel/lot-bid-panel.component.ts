import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { LotDetails } from '../../../../../core/models/lot.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { FinanceService } from '../../../../../core/services/finance.service';
import { TuiButton } from '@taiga-ui/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TuiInputNumber } from '@taiga-ui/kit';

const QUICK_BID_CONFIG: { label: string; steps: number }[] = [
  { label: 'Минимальный шаг', steps: 1 },
  { label: 'Два шага', steps: 2 },
  { label: 'Пять шагов', steps: 5 },
  { label: 'Десять шагов', steps: 10 },
];

@Component({
  selector: 'app-lot-bid-panel',
  imports: [CurrencyComponent, TuiButton, ReactiveFormsModule, DecimalPipe, TuiInputNumber],
  standalone: true,
  templateUrl: './lot-bid-panel.component.html',
  styleUrl: './lot-bid-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidPanelComponent {
  private readonly authService = inject(AuthService);
  private readonly financeService = inject(FinanceService);

  readonly lot = input.required<LotDetails>();

  protected readonly quickBids = computed(() =>
    QUICK_BID_CONFIG.map((bid) => ({
      label: bid.label,
      amount: bid.steps * this.lot().bidStepByn,
    })),
  );
  protected readonly minBid = computed(() => this.lot().currentBidByn + this.lot().bidStepByn);
  protected amountControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(10000),
  ]);
}
