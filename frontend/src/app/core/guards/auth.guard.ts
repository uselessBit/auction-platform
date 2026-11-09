import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = false;

  if (isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree(['/catalog']);
  }
};
