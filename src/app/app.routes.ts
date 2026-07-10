import { CanMatchFn, Routes } from '@angular/router';

const RESTAURANT_AUTH_PATHS = new Set(['login', 'forgot-password', 'verify-otp', 'register']);

const matchesRestaurantAuth: CanMatchFn = (_route, segments) => {
  const firstPath = segments[0]?.path;
  const requestedPath = firstPath === 'restaurant' ? segments[1]?.path : firstPath;
  return !requestedPath || RESTAURANT_AUTH_PATHS.has(requestedPath);
};

/** Root routes — restaurant auth, onboarding, and workspace. */
export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'restaurant/login', pathMatch: 'full' },
  {
    path: 'restaurant',
    canMatch: [matchesRestaurantAuth],
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
    path: 'restaurant',
    loadComponent: () =>
      import('./core/layout/restaurant-shell/restaurant-shell.component').then(
        (m) => m.RestaurantShellComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/restaurant/restaurant-workspace.routes').then(
            (m) => m.RESTAURANT_WORKSPACE_ROUTES
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'restaurant/login' },
];
