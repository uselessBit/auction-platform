import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LotCardComponent } from '../../../shared/components/lot-card/lot-card.component';
import { LotsService } from '../../../core/services/lots.service';
import { map, Observable } from 'rxjs';
import { Lot } from '../../../core/models/lot.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-ended-catalog',
  imports: [AsyncPipe, LotCardComponent, RouterLink, RouterLinkActive, TuiButton],
  templateUrl: './ended-catalog.component.html',
  styleUrl: './ended-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndedCatalogComponent {
  private lotsService = inject(LotsService);
  endedLots$: Observable<Lot[]> = this.lotsService
    .getLots()
    .pipe(
      map((lots) =>
        lots.filter(
          (lot) => lot.status === 'finished' || lot.status === 'cancelled' || lot.status === 'sold',
        ),
      ),
    );
}
