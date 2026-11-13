import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-floating-badge',
  imports: [],
  standalone: true,
  templateUrl: './floating-badge.component.html',
  styleUrl: './floating-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingBadgeComponent {
  readonly text = input.required<string>();
  readonly visible = input<boolean>(false);
}
