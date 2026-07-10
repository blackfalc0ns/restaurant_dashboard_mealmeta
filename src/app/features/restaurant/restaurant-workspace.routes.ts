import { Routes } from '@angular/router';

const loadEmptyPage = () =>
  import('./pages/restaurant-empty-page.component').then(
    (m) => m.RestaurantEmptyPageComponent,
  );

const loadOverviewPage = () =>
  import('./overview/restaurant-overview.page').then(
    (m) => m.RestaurantOverviewPageComponent,
  );

const loadAnalyticsPage = () =>
  import('./overview/analytics/restaurant-analytics.page').then(
    (m) => m.RestaurantAnalyticsPageComponent,
  );

const loadOperationsPage = () =>
  import('./overview/operations/restaurant-operations.page').then(
    (m) => m.RestaurantOperationsPageComponent,
  );

const loadFinanceOverviewPage = () =>
  import('./overview/finance/restaurant-finance-overview.page').then(
    (m) => m.RestaurantFinanceOverviewPageComponent,
  );

const loadQualityOverviewPage = () =>
  import('./overview/quality/restaurant-quality-overview.page').then(
    (m) => m.RestaurantQualityOverviewPageComponent,
  );

const loadActivityPage = () =>
  import('./overview/activity/restaurant-activity.page').then(
    (m) => m.RestaurantActivityPageComponent,
  );

const loadDailyOrdersPage = () =>
  import('./daily-orders/daily-orders.page').then(
    (m) => m.DailyOrdersPageComponent,
  );

const loadOrderDetailPage = () =>
  import('./daily-orders/detail/order-detail.page').then(
    (m) => m.OrderDetailPageComponent,
  );

const loadPendingConfirmationPage = () =>
  import('./pending-confirmation/pending-confirmation.page').then(
    (m) => m.PendingConfirmationPageComponent,
  );

const loadUpcoming24hPage = () =>
  import('./upcoming-24h/upcoming-24h.page').then(
    (m) => m.Upcoming24hPageComponent,
  );

const loadLabelsPage = () =>
  import('./labels/labels.page').then((m) => m.LabelsPageComponent);

const SIDEBAR_LINK_PATHS = [
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
  {
    path: 'overview',
    loadComponent: loadOverviewPage,
  },
  {
    path: 'overview/analytics',
    loadComponent: loadAnalyticsPage,
  },
  {
    path: 'overview/operations',
    loadComponent: loadOperationsPage,
  },
  {
    path: 'overview/finance',
    loadComponent: loadFinanceOverviewPage,
  },
  {
    path: 'overview/quality',
    loadComponent: loadQualityOverviewPage,
  },
  {
    path: 'overview/activity',
    loadComponent: loadActivityPage,
  },
  {
    path: 'orders/daily',
    loadComponent: loadDailyOrdersPage,
  },
  {
    path: 'orders/detail/:orderCode',
    loadComponent: loadOrderDetailPage,
  },
  {
    path: 'orders/pending-confirmation',
    loadComponent: loadPendingConfirmationPage,
  },
  {
    path: 'orders/upcoming-24h',
    loadComponent: loadUpcoming24hPage,
  },
  {
    path: 'orders/labels',
    loadComponent: loadLabelsPage,
  },
  ...SIDEBAR_LINK_PATHS.map((path) => ({
    path,
    loadComponent: loadEmptyPage,
  })),
  { path: '**', loadComponent: loadEmptyPage },
];
