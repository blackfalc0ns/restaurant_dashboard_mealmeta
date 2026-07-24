import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RestaurantAuthStore } from '../../auth/restaurant-auth.store';

export const restaurantAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(RestaurantAuthStore).accessToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
