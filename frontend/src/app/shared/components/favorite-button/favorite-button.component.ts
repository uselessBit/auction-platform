import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-favorite-button',
  imports: [TuiButton],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteButtonComponent {
  readonly isFavorite = input<boolean | undefined>(false);
  readonly toggle = output<void>();

  toggleState(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.toggle.emit();
  }
}
