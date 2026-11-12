import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LotCardComponent } from '../../shared/components/lot-card/lot-card.component';
import { LotsService } from '../../core/services/lots.service';
import { Lot } from '../../core/models/lot.model';
import { NEVER, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [LotCardComponent, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent {
  private lotsService = inject(LotsService);
  lots$: Observable<Lot[]> = this.lotsService.getLots();
}
