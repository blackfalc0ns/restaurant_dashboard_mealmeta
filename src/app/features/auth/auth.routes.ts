import { Routes } from '@angular/router';

import { RestaurantAuthLocaleService } from './state/auth-locale.service';
import { RestaurantAuthRecoveryFacade } from './state/auth-recovery.facade';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/restaurant-auth-layout.component').then((m) => m.RestaurantAuthLayoutComponent),
    providers: [RestaurantAuthLocaleService, RestaurantAuthRecoveryFacade],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/restaurant-login-page/restaurant-login-page.component').then(
            (m) => m.RestaurantLoginPageComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/restaurant-forgot-password-page/restaurant-forgot-password-page.component').then(
            (m) => m.RestaurantForgotPasswordPageComponent
          ),
      },
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./pages/restaurant-verify-otp-page/restaurant-verify-otp-page.component').then(
            (m) => m.RestaurantVerifyOtpPageComponent
          ),
      },
      {
        path: 'register',
        redirectTo: '/restaurant/onboarding',
        pathMatch: 'full',
      },
    ],
  },
];
