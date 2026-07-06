import { Routes } from '@angular/router';

import { RestaurantAuthLocaleService } from '@/features/auth/state/auth-locale.service';
import { RestaurantOnboardingFacade } from './state/onboarding.facade';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/restaurant-onboarding-page/restaurant-onboarding-page.component').then(
        (m) => m.RestaurantOnboardingPageComponent
      ),
    providers: [RestaurantAuthLocaleService, RestaurantOnboardingFacade],
  },
];
