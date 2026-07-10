import { Routes } from '@angular/router';

const loadEmptyPage = () =>
  import('../pages/restaurant-empty-page.component').then(
    (m) => m.RestaurantEmptyPageComponent,
  );

export const ORDER_72H_RULE_ROUTES: Routes = [
  { path: 'pending-confirmation', loadComponent: loadEmptyPage },
  { path: 'upcoming-24h', loadComponent: loadEmptyPage },
  { path: ':id/72h', loadComponent: loadEmptyPage },
];
