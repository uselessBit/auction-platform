import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LotSpecsComponent } from './components/lot-specs/lot-specs.component';
import { LotsService } from '../../../core/services/lots.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LotGalleryComponent } from './components/lot-gallery/lot-gallery.component';
import { LotPriceChartComponent } from './components/lot-price-chart/lot-price-chart.component';
import { LotBidSummaryComponent } from './components/lot-bid-summary/lot-bid-summary.component';
import { LotBidsListComponent } from './components/lot-bids-list/lot-bids-list.component';
import { LotBidPanelComponent } from './components/lot-bid-panel/lot-bid-panel.component';
import { BID_HISTORY_STATUSES, BlockedBidStatus } from '../../../core/models/lot.model';
import { AuthModalService } from '../../../core/services/auth-modal.service';

@Component({
  selector: 'app-lot-details',
  imports: [
    LotSpecsComponent,
    AsyncPipe,
    LotGalleryComponent,
    LotPriceChartComponent,
    LotBidSummaryComponent,
    LotBidsListComponent,
    LotBidPanelComponent,
  ],
  standalone: true,
  templateUrl: './lot-details.component.html',
  styleUrl: './lot-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotDetailsComponent {
  private readonly lotsService = inject(LotsService);
  private readonly authModal = inject(AuthModalService);

  protected readonly id = input.required<string>({ alias: 'id' });

  protected readonly lot$ = toObservable(this.id).pipe(
    switchMap((id) => this.lotsService.getLotById(id)),
  );
  protected readonly bidHistoryStatuses = BID_HISTORY_STATUSES;

  protected onBidSubmit(amount: number): void {
    console.info('Ставка подтверждена:', amount);
  }

  protected onBlockedAction(status: BlockedBidStatus): void {
    if (status === 'auth_required') {
      this.authModal.open();
    }
  }
}
