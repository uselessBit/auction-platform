import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  imports: [],
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
