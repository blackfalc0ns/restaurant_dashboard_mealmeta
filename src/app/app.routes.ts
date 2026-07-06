import { Routes } from '@angular/router';

/** Root routes — restaurant auth + F06 orders */
export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'restaurant/login', pathMatch: 'full' },
  {
    path: 'restaurant',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'restaurant/onboarding',
    loadChildren: () =>
      import('./features/restaurant/onboarding/onboarding.routes').then((m) => m.ONBOARDING_ROUTES),
  },
  {
    path: 'restaurant/setup-wizard',
    loadComponent: () =>
      import('./features/restaurant/pages/restaurant-setup-stub-page/restaurant-setup-stub-page.component').then(
        (m) => m.RestaurantSetupStubPageComponent
      ),
  },
  {
    path: 'restaurant/orders',
    loadComponent: () =>
      import('./core/layout/restaurant-shell/restaurant-shell.component').then(
        (m) => m.RestaurantShellComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/restaurant/order-72h-rule/order-72h-rule.routes').then(
            (m) => m.ORDER_72H_RULE_ROUTES
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'restaurant/login' },
];
