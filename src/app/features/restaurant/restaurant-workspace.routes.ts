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

const loadHandoverPage = () =>
  import('./handover/handover.page').then((m) => m.HandoverPageComponent);

const loadHandoverDetailPage = () =>
  import('./handover/detail/handover-detail.page').then(
    (m) => m.HandoverDetailPageComponent,
  );

const loadArchivePage = () =>
  import('./archive/archive.page').then((m) => m.ArchivePageComponent);

const loadMenuPage = () =>
  import('./menu/menu.page').then((m) => m.MenuPageComponent);

const loadMenuCreatePage = () =>
  import('./menu/create/menu-create.page').then(
    (m) => m.MenuCreatePageComponent,
  );

const loadMenuDetailPage = () =>
  import('./menu/detail/menu-detail.page').then(
    (m) => m.MenuDetailPageComponent,
  );

const loadIngredientsPage = () =>
  import('./ingredients/ingredients.page').then(
    (m) => m.IngredientsPageComponent,
  );

const loadIngredientCreatePage = () =>
  import('./ingredients/create/ingredient-create.page').then(
    (m) => m.IngredientCreatePageComponent,
  );

const loadPricingPage = () =>
  import('./pricing/pricing.page').then((m) => m.PricingPageComponent);

const loadServiceRegionsPage = () =>
  import('./service-regions/service-regions.page').then(
    (m) => m.ServiceRegionsPageComponent,
  );

const loadServiceRegionDetailPage = () =>
  import('./service-regions/service-region-detail.page').then(
    (m) => m.ServiceRegionDetailPageComponent,
  );

const loadCapacityPage = () =>
  import('./capacity/capacity.page').then((m) => m.CapacityPageComponent);

const loadDriversPage = () =>
  import('./drivers/drivers.page').then((m) => m.DriversPageComponent);

const loadDriverDetailPage = () =>
  import('./drivers/driver-detail.page').then(
    (m) => m.DriverDetailPageComponent,
  );

const loadRatingsPage = () =>
  import('./ratings/ratings.page').then((m) => m.RatingsPageComponent);

const loadTripsPage = () =>
  import('./trips/trips.page').then((m) => m.TripsPageComponent);

const loadTripDetailPage = () =>
  import('./trips/trip-detail.page').then((m) => m.TripDetailPageComponent);

const loadDispatchOfficersPage = () =>
  import('./dispatch/dispatch-officers.page').then(
    (m) => m.DispatchOfficersPageComponent,
  );

const loadDispatchOfficerDetailPage = () =>
  import('./dispatch/dispatch-officer-detail.page').then(
    (m) => m.DispatchOfficerDetailPageComponent,
  );

const loadDuesPage = () =>
  import('./dues/dues.page').then((m) => m.DuesPageComponent);

const loadDueDetailPage = () =>
  import('./dues/due-detail.page').then((m) => m.DueDetailPageComponent);

const loadDeductionsPage = () =>
  import('./deductions/deductions.page').then((m) => m.DeductionsPageComponent);

const loadDeductionDetailPage = () =>
  import('./deductions/deduction-detail.page').then(
    (m) => m.DeductionDetailPageComponent,
  );

const loadInvoicesPage = () =>
  import('./invoices/invoices.page').then((m) => m.InvoicesPageComponent);

const loadInvoiceDetailPage = () =>
  import('./invoices/invoice-detail.page').then(
    (m) => m.InvoiceDetailPageComponent,
  );

const loadPayoutsPage = () =>
  import('./payouts/payouts.page').then((m) => m.PayoutsPageComponent);

const loadPayoutDetailPage = () =>
  import('./payouts/payout-detail.page').then((m) => m.PayoutDetailPageComponent);

const loadStatementsPage = () =>
  import('./statements/statements.page').then((m) => m.StatementsPageComponent);

const loadStatementDetailPage = () =>
  import('./statements/statement-detail.page').then(
    (m) => m.StatementDetailPageComponent,
  );

const loadReportsPage = () =>
  import('./reports/reports.page').then((m) => m.ReportsPageComponent);

const loadReportDetailPage = () =>
  import('./reports/report-detail.page').then(
    (m) => m.ReportDetailPageComponent,
  );

const loadSettingsPage = () =>
  import('./settings/settings.page').then((m) => m.SettingsPageComponent);

const loadBranchesPage = () =>
  import('./team/branches/branches.page').then((m) => m.BranchesPageComponent);

const loadBranchDetailPage = () =>
  import('./team/branches/branch-detail.page').then(
    (m) => m.BranchDetailPageComponent,
  );

const loadStaffPage = () =>
  import('./team/staff/staff.page').then((m) => m.StaffPageComponent);

const loadStaffDetailPage = () =>
  import('./team/staff/staff-detail.page').then(
    (m) => m.StaffDetailPageComponent,
  );

const loadPermissionsPage = () =>
  import('./team/permissions/permissions.page').then(
    (m) => m.PermissionsPageComponent,
  );

const SIDEBAR_LINK_PATHS: string[] = [];

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
  {
    path: 'orders/handover',
    loadComponent: loadHandoverPage,
  },
  {
    path: 'orders/handover/:orderCode',
    loadComponent: loadHandoverDetailPage,
  },
  {
    path: 'orders/archive',
    loadComponent: loadArchivePage,
  },
  {
    path: 'operations/menu/create',
    loadComponent: loadMenuCreatePage,
  },
  {
    path: 'operations/menu/:mealId',
    loadComponent: loadMenuDetailPage,
  },
  {
    path: 'operations/menu',
    loadComponent: loadMenuPage,
  },
  {
    path: 'operations/ingredients/create',
    loadComponent: loadIngredientCreatePage,
  },
  {
    path: 'operations/ingredients',
    loadComponent: loadIngredientsPage,
  },
  {
    path: 'operations/pricing',
    loadComponent: loadPricingPage,
  },
  {
    path: 'operations/service-regions/:regionId',
    loadComponent: loadServiceRegionDetailPage,
  },
  {
    path: 'operations/service-regions',
    loadComponent: loadServiceRegionsPage,
  },
  {
    path: 'operations/capacity',
    loadComponent: loadCapacityPage,
  },
  {
    path: 'operations/availability',
    redirectTo: 'operations/capacity',
    pathMatch: 'full',
  },
  {
    path: 'delivery/drivers/:driverId',
    loadComponent: loadDriverDetailPage,
  },
  {
    path: 'delivery/drivers',
    loadComponent: loadDriversPage,
  },
  {
    path: 'delivery/dispatch/create',
    redirectTo: 'delivery/dispatch',
    pathMatch: 'full',
  },
  {
    path: 'delivery/dispatch/:officerId',
    loadComponent: loadDispatchOfficerDetailPage,
  },
  {
    path: 'delivery/dispatch',
    loadComponent: loadDispatchOfficersPage,
  },
  {
    path: 'delivery/trips/create',
    redirectTo: 'delivery/trips',
    pathMatch: 'full',
  },
  {
    path: 'delivery/trips/:tripId',
    loadComponent: loadTripDetailPage,
  },
  {
    path: 'delivery/trips',
    loadComponent: loadTripsPage,
  },
  {
    path: 'quality/ratings',
    loadComponent: loadRatingsPage,
  },
  {
    path: 'finance/dues/:dueId',
    loadComponent: loadDueDetailPage,
  },
  {
    path: 'finance/dues',
    loadComponent: loadDuesPage,
  },
  {
    path: 'finance/deductions/:deductionId',
    loadComponent: loadDeductionDetailPage,
  },
  {
    path: 'finance/deductions',
    loadComponent: loadDeductionsPage,
  },
  {
    path: 'finance/invoices/:invoiceId',
    loadComponent: loadInvoiceDetailPage,
  },
  {
    path: 'finance/invoices',
    loadComponent: loadInvoicesPage,
  },
  {
    path: 'finance/payouts/:payoutId',
    loadComponent: loadPayoutDetailPage,
  },
  {
    path: 'finance/payouts',
    loadComponent: loadPayoutsPage,
  },
  {
    path: 'finance/statements/:statementId',
    loadComponent: loadStatementDetailPage,
  },
  {
    path: 'finance/statements',
    loadComponent: loadStatementsPage,
  },
  {
    path: 'finance/reports/:reportId',
    loadComponent: loadReportDetailPage,
  },
  {
    path: 'finance/reports',
    loadComponent: loadReportsPage,
  },
  {
    path: 'team/branches/:branchId',
    loadComponent: loadBranchDetailPage,
  },
  {
    path: 'team/branches',
    loadComponent: loadBranchesPage,
  },
  {
    path: 'team/staff/:staffId',
    loadComponent: loadStaffDetailPage,
  },
  {
    path: 'team/staff',
    loadComponent: loadStaffPage,
  },
  {
    path: 'team/permissions',
    loadComponent: loadPermissionsPage,
  },
  {
    path: 'settings',
    loadComponent: loadSettingsPage,
  },
  ...SIDEBAR_LINK_PATHS.map((path) => ({
    path,
    loadComponent: loadEmptyPage,
  })),
  { path: '**', loadComponent: loadEmptyPage },
];
