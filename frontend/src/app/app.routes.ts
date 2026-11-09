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
      import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'catalog/ended',
    loadComponent: () =>
      import('./features/catalog/ended-catalog/ended-catalog.component').then(
        (m) => m.EndedCatalogComponent,
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
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'rules',
    loadComponent: () => import('./features/rules/rules.component').then((m) => m.RulesComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'admin/create',
    loadComponent: () =>
      import('./features/admin/lot-create/lot-create.component').then((m) => m.LotCreateComponent),
  },
  {
    path: '**',
    redirectTo: 'catalog',
  },
];
