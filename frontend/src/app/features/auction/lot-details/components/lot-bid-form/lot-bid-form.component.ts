import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { LotDetails } from '../../../../../core/models/lot.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { DecimalPipe } from '@angular/common';
import { TuiButton, TuiIcon, TuiTextfieldComponent } from '@taiga-ui/core';
import { TuiInputNumberDirective } from '@taiga-ui/kit';

type AmountFormState = 'idle' | 'min' | 'required' | 'valid';

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
    TuiButton,
    TuiInputNumberDirective,
    TuiTextfieldComponent,
    ReactiveFormsModule,
    TuiIcon,
  ],
  standalone: true,
  templateUrl: './lot-bid-form.component.html',
  styleUrl: './lot-bid-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotBidFormComponent {
  readonly lot = input.required<LotDetails>();
  readonly bidRequested = output<number>();

  protected readonly quickBids = computed(() => {
    const { bidStepByn, currentBidByn } = this.lot();

    return QUICK_BID_CONFIG.map((bid) => {
      const amount = bid.steps * bidStepByn;
      return {
        label: bid.label,
        amount,
        total: currentBidByn + amount,
      };
    });
  });
  protected readonly minBid = computed(() => this.lot().currentBidByn + this.lot().bidStepByn);
  protected readonly amountControl = new FormControl<number | null>(null, [Validators.required]);

  private readonly amountEvents = toSignal(this.amountControl.events);
  protected readonly bidFeedback = computed<AmountFormState>(() => {
    this.amountEvents();

    if (this.amountControl.valid && this.amountControl.value !== null) {
      return 'valid';
    }
    if (this.amountControl.invalid && this.amountControl.touched) {
      return this.amountControl.hasError('required') ? 'required' : 'min';
    }
    return 'idle';
  });
  protected readonly bidDifference = computed(() => {
    this.amountEvents();
    const value = this.amountControl.value;

    return value === null ? 0 : value - this.lot().currentBidByn;
  });

  constructor() {
    effect(() => {
      this.amountControl.setValidators([Validators.required, Validators.min(this.minBid())]);
      this.amountControl.updateValueAndValidity();
    });

    this.amountControl.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (value) => {
        if (value === null) {
          this.amountControl.markAsUntouched();
        }
      },
    });
  }

  protected onCustomBid(): void {
    this.amountControl.markAllAsTouched();
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
