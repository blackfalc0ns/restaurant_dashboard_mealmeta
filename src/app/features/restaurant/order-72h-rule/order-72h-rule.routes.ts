import { Routes } from '@angular/router';

export const ORDER_72H_RULE_ROUTES: Routes = [
  {
    path: 'pending-confirmation',
    loadComponent: () =>
      import(
        './pages/pending-confirmation-page/pending-confirmation-page.component'
      ).then((m) => m.PendingConfirmationPageComponent),
  },
  {
    path: 'upcoming-24h',
    loadComponent: () =>
      import('./pages/upcoming-24h-page/upcoming-24h-page.component').then(
        (m) => m.Upcoming24hPageComponent
      ),
  },
  {
    path: ':id/72h',
    loadComponent: () =>
      import('./pages/order-72h-detail-page/order-72h-detail-page.component').then(
        (m) => m.Order72hDetailPageComponent
      ),
  },
];
