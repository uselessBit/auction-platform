import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lot-create',
  imports: [],
  standalone: true,
  templateUrl: './lot-create.component.html',
  styleUrl: './lot-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LotCreateComponent {}
