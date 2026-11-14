import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LotSpecsComponent } from './components/lot-specs/lot-specs.component';
import { LotsService } from '../../../core/services/lots.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LotGalleryComponent } from './components/lot-gallery/lot-gallery.component';
import { LotPriceChartComponent } from './components/lot-price-chart/lot-price-chart.component';

@Component({
  selector: 'app-lot-details',
  imports: [LotSpecsComponent, AsyncPipe, LotGalleryComponent, LotPriceChartComponent],
  standalone: true,
  templateUrl: './lot-details.component.html',
  styleUrl: './lot-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotDetailsComponent {
  protected readonly id = input.required<string>({ alias: 'id' });
  private readonly lotsService = inject(LotsService);

  protected readonly lot$ = toObservable(this.id).pipe(
    switchMap((id) => this.lotsService.getLotById(id)),
  );
}
