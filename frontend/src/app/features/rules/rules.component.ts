import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rules',
  imports: [],
  standalone: true,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {}
