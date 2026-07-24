import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RestaurantAuthStore } from './restaurant-auth.store';

export const restaurantAuthGuard: CanActivateFn = () => {
  const auth = inject(RestaurantAuthStore);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/restaurant/login']);
};
