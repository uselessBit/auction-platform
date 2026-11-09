import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lot-details',
  standalone: true,
  templateUrl: './lot-details.component.html',
  styleUrl: './lot-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotDetailsComponent {
  lotIdFromInput = input.required<string>({ alias: 'id' });
}
