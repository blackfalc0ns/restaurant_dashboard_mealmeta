import { Routes } from '@angular/router';

const loadEmptyPage = () =>
  import('./pages/restaurant-empty-page.component').then(
    (m) => m.RestaurantEmptyPageComponent,
  );

const SIDEBAR_LINK_PATHS = [
  'overview',
  'overview/analytics',
  'overview/operations',
  'overview/finance',
  'overview/quality',
  'overview/activity',
  'orders/daily',
  'orders/pending-confirmation',
  'orders/upcoming-24h',
  'orders/labels',
  'orders/handover',
  'orders/archive',
  'operations/menu',
  'operations/ingredients',
  'operations/pricing',
  'operations/service-regions',
  'operations/capacity',
  'operations/availability',
  'delivery/drivers',
  'quality/ratings',
  'finance/dues',
  'finance/deductions',
  'finance/invoices',
  'finance/payouts',
  'finance/statements',
  'finance/reports',
  'settings',
];

export const RESTAURANT_WORKSPACE_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  ...SIDEBAR_LINK_PATHS.map((path) => ({
    path,
    loadComponent: loadEmptyPage,
  })),
  { path: '**', loadComponent: loadEmptyPage },
];
