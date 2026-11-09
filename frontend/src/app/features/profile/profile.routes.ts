import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    redirectTo: 'data',
    pathMatch: 'full',
  },
  {
    path: 'data',
    loadComponent: () =>
      import('./data/profile-data.component').then((m) => m.ProfileDataComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/profile-favorites.component').then((m) => m.ProfileFavoritesComponent),
  },
];
