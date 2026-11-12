import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LotCardComponent } from '../../shared/components/lot-card/lot-card.component';
import { LotsService } from '../../core/services/lots.service';
import { Lot } from '../../core/models/lot.model';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [LotCardComponent, AsyncPipe, RouterLink, RouterLinkActive, TuiButton],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent {
  private lotsService = inject(LotsService);
  activeLots$: Observable<Lot[]> = this.lotsService
    .getLots()
    .pipe(
      map((lots) => lots.filter((lot) => lot.status === 'active' || lot.status === 'upcoming')),
    );
}
