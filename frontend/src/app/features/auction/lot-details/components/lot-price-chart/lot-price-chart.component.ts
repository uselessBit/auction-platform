import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TuiPoint } from '@taiga-ui/core';
import { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import {
  TUI_ALWAYS_DASHED,
  TuiAxes,
  TuiChartHint,
  TuiLineChart,
  TuiLineHandler,
} from '@taiga-ui/addon-charts';
import { CurrencyComponent } from '../../../../../shared/components/currency/currency.component';
import { LotDetails, LotBid } from '../../../../../core/models/lot.model';

@Component({
  selector: 'app-lot-price-chart',
  imports: [TuiAxes, TuiLineChart, CurrencyComponent, TuiChartHint],
  standalone: true,
  templateUrl: './lot-price-chart.component.html',
  styleUrl: './lot-price-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotPriceChartComponent {
  readonly lot = input.required<LotDetails>();

  protected readonly bids = computed<readonly LotBid[]>(() => this.lot().bids.toReversed());
  protected readonly len = computed<number>(() => this.bids().length);

  protected readonly horizontalLines: number = 4;
  protected readonly verticalLines: number = 5;

  protected readonly points = computed<readonly TuiPoint[]>(() =>
    this.bids().map((bid, id) => [id, bid.amountByn]),
  );
  protected readonly minY = computed<number>(() => this.bids()[0].amountByn);
  protected readonly heightY = computed<number>(
    () => this.bids()[this.len() - 1].amountByn - this.minY(),
  );
  protected readonly widthX = computed<number>(() => Math.max(this.len() - 1, 1));
  protected readonly axisYLabels = computed<readonly string[]>(() => {
    const min: number = this.minY();
    const height: number = this.heightY();
    const steps = 6;

    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = Math.round(min + (height / steps) * i);
      return `${value.toLocaleString()} BYN`;
    });
  });

  protected readonly horizontalLinesHandler = TUI_ALWAYS_DASHED;
  protected readonly verticalLinesHandler: TuiLineHandler = (index, total) =>
    index === 0 ? 'solid' : index === total - 1 ? 'none' : 'dashed';
  protected readonly yStringify: TuiStringHandler<number> = (y) => `${y.toLocaleString()} BYN`;
  protected readonly hintContent = ({ $implicit }: TuiContext<TuiPoint>): string =>
    `${$implicit[1].toLocaleString()} BYN`;
}
