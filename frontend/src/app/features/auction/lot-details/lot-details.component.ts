import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LotSpecsComponent } from './components/lot-specs/lot-specs.component';
import { LotsService } from '../../../core/services/lots.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-lot-details',
  standalone: true,
  templateUrl: './lot-details.component.html',
  styleUrl: './lot-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LotSpecsComponent, AsyncPipe],
})
export class LotDetailsComponent {
  protected readonly id = input.required<string>({ alias: 'id' });
  private readonly lotsService = inject(LotsService);

  protected readonly lot$ = toObservable(this.id).pipe(
    switchMap((id) => this.lotsService.getLotById(id)),
  );
}
