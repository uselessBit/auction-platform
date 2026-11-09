import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './profile-favorites.component.html',
  styleUrl: './profile-favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFavoritesComponent {}
