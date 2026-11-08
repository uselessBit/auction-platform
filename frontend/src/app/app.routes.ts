import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full',
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/catalog.component').then(
        (m) => m.CatalogComponent,
      ),
  },
  {
    path: 'lots/:id',
    loadComponent: () =>
      import('./features/auction/lot-details/lot-details.component').then(
        (m) => m.LotDetailsComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'admin/create',
    loadComponent: () =>
      import('./features/admin/lot-create/lot-create.component').then(
        (m) => m.LotCreateComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'catalog',
  },
];
