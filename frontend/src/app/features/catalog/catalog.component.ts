import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LotCardComponent } from '../../shared/components/lot-card/lot-card.component';
import { LotsService } from '../../core/services/lots.service';
import { ACTIVE_CATALOG_STATUSES, Lot } from '../../core/models/lot.model';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-catalog',
  imports: [LotCardComponent, AsyncPipe, RouterLink, RouterLinkActive, TuiButton],
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent {
  private readonly lotsService = inject(LotsService);
  protected readonly activeLots$: Observable<Lot[]> = this.lotsService
    .getLots()
    .pipe(map((lots) => lots.filter((lot) => ACTIVE_CATALOG_STATUSES.has(lot.status))));
}
