import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { DecimalPipe } from '@angular/common';
import { TuiButton, TuiTextfieldComponent, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { TuiInputNumberDirective } from '@taiga-ui/kit';

interface QuickBidConfig {
  readonly label: string;
  readonly steps: number;
}

const QUICK_BID_CONFIG: readonly QuickBidConfig[] = [
  { label: 'Минимальный шаг', steps: 1 },
  { label: 'Два шага', steps: 2 },
  { label: 'Пять шагов', steps: 5 },
  { label: 'Десять шагов', steps: 10 },
];

@Component({
  selector: 'app-lot-bid-form',
  imports: [
    CurrencyComponent,
    DecimalPipe,
    FormsModule,
    TuiButton,
    TuiInputNumberDirective,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './lot-bid-form.component.html',
  styleUrl: './lot-bid-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidFormComponent {
  readonly lot = input.required<LotDetails>();
  readonly bidRequested = output<number>();

  protected readonly quickBids = computed(() =>
    QUICK_BID_CONFIG.map((bid) => ({
      label: bid.label,
      amount: bid.steps * this.lot().bidStepByn,
    })),
  );
  protected readonly minBid = computed(() => this.lot().currentBidByn + this.lot().bidStepByn);
  protected readonly amountControl = new FormControl<number | null>(null, [Validators.required]);

  private readonly amountStatus = toSignal(this.amountControl.statusChanges, {
    initialValue: this.amountControl.status,
  });
  protected readonly isSubmitDisabled = computed(() => this.amountStatus() !== 'VALID');

  constructor() {
    effect(() => {
      this.amountControl.setValidators([Validators.required, Validators.min(this.minBid())]);
      this.amountControl.updateValueAndValidity();
    });
  }

  protected onCustomBid(): void {
    if (this.amountControl.invalid || this.amountControl.value === null) {
      return;
    }

    this.bidRequested.emit(this.amountControl.value);
  }

  protected onQuickBid(value: number): void {
    this.bidRequested.emit(this.lot().currentBidByn + value);
  }

  resetCustomBid(): void {
    this.amountControl.reset();
  }
}
