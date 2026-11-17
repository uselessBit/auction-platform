import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  imports: [],
  standalone: true,
  templateUrl: './profile-favorites.component.html',
  styleUrl: './profile-favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFavoritesComponent {}
