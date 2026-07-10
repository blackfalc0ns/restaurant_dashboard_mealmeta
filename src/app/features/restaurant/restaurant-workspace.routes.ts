import { Routes } from '@angular/router';

import { ORDER_72H_RULE_ROUTES } from './order-72h-rule/order-72h-rule.routes';

const loadFeaturePage = () =>
  import('./pages/restaurant-feature-page/restaurant-feature-page.component').then(
    (m) => m.RestaurantFeaturePageComponent,
  );

export const RESTAURANT_WORKSPACE_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview/analytics',
    loadComponent: () =>
      import('./overview/restaurant-analytics-page.component').then(
        (m) => m.RestaurantAnalyticsPageComponent,
      ),
  },
  {
    path: 'overview/activity',
    loadComponent: () =>
      import('./overview/restaurant-activity-page.component').then(
        (m) => m.RestaurantActivityPageComponent,
      ),
  },
  {
    path: 'overview/operations',
    loadComponent: () =>
      import('./overview/restaurant-domain-overview-page.component').then(
        (m) => m.RestaurantDomainOverviewPageComponent,
      ),
    data: { domain: 'operations' },
  },
  {
    path: 'overview/finance',
    loadComponent: () =>
      import('./overview/restaurant-domain-overview-page.component').then(
        (m) => m.RestaurantDomainOverviewPageComponent,
      ),
    data: { domain: 'finance' },
  },
  {
    path: 'overview/quality',
    loadComponent: () =>
      import('./overview/restaurant-domain-overview-page.component').then(
        (m) => m.RestaurantDomainOverviewPageComponent,
      ),
    data: { domain: 'quality' },
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/restaurant-overview-page.component').then(
        (m) => m.RestaurantOverviewPageComponent,
      ),
  },
  {
    path: 'orders',
    children: [
      ...ORDER_72H_RULE_ROUTES,
      {
        path: 'daily',
        loadComponent: () =>
          import('./daily-orders/daily-orders-page.component').then(
            (m) => m.DailyOrdersPageComponent,
          ),
      },
      {
        path: 'labels',
        loadComponent: loadFeaturePage,
        data: {
          titleAr: 'الملصقات والباركود',
          titleEn: 'Labels & barcodes',
          descriptionAr: 'تجهيز وطباعة فواتير الطلبات وباركود وملصقات الوجبات.',
          descriptionEn: 'Prepare and print order invoices, barcodes, and meal labels.',
          features: ['F035'],
        },
      },
      {
        path: 'handover',
        loadComponent: loadFeaturePage,
        data: {
          titleAr: 'تسليم الطلبات',
          titleEn: 'Order handover',
          descriptionAr: 'التحقق من الطلب وتسجيل تسليمه للسائق بالباركود.',
          descriptionEn: 'Verify orders and record barcode-based handover to drivers.',
          features: ['F036'],
        },
      },
      {
        path: 'archive',
        loadComponent: loadFeaturePage,
        data: {
          titleAr: 'أرشيف الطلبات',
          titleEn: 'Orders archive',
          descriptionAr: 'مراجعة سجل الطلبات السابقة وحالاتها التشغيلية.',
          descriptionEn: 'Review historical orders and their operational statuses.',
          features: ['F033', 'F034'],
        },
      },
    ],
  },
  {
    path: 'operations/menu',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'القوائم والوجبات',
      titleEn: 'Menus & meals',
      descriptionAr: 'إدارة نسخ القوائم والوجبات ومكوناتها وحالة توفرها.',
      descriptionEn: 'Manage versioned menus, meals, ingredients, and availability.',
      features: ['F028'],
    },
  },
  {
    path: 'operations/ingredients',
    loadComponent: () =>
      import('./ingredients/restaurant-ingredients-page.component').then(
        (m) => m.RestaurantIngredientsPageComponent,
      ),
  },
  {
    path: 'operations/pricing',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'إدارة الأسعار',
      titleEn: 'Pricing management',
      descriptionAr: 'إدارة قوائم أسعار المطعم وتواريخ سريانها.',
      descriptionEn: 'Manage restaurant price lists and their effective dates.',
      features: ['F029'],
    },
  },
  {
    path: 'operations/service-regions',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'مناطق الخدمة',
      titleEn: 'Service regions',
      descriptionAr: 'تحديد المناطق التي يستطيع المطعم خدمتها ومراجعة تغطيتها.',
      descriptionEn: 'Define and review the regions served by the restaurant.',
      features: ['F030'],
    },
  },
  {
    path: 'operations/capacity',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'السعة اليومية',
      titleEn: 'Daily capacity',
      descriptionAr: 'ضبط الطاقة الاستيعابية اليومية ومنع تجاوز حدود التشغيل.',
      descriptionEn: 'Set daily capacity and prevent operational overbooking.',
      features: ['F031'],
    },
  },
  {
    path: 'operations/availability',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'التوفر وحالة الانشغال',
      titleEn: 'Availability & busy status',
      descriptionAr: 'متابعة الجاهزية وحالة الانشغال التلقائية والاستثناءات الموثقة.',
      descriptionEn: 'Track readiness, automated busy status, and audited overrides.',
      features: ['F032'],
    },
  },
  {
    path: 'delivery/drivers',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'السائقون',
      titleEn: 'Drivers',
      descriptionAr: 'إدارة سائقي المطعم وحالتهم وتكليفاتهم.',
      descriptionEn: 'Manage restaurant drivers, availability, and assignments.',
      features: ['F037'],
    },
  },
  {
    path: 'quality/ratings',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'التقييمات',
      titleEn: 'Ratings',
      descriptionAr: 'متابعة تقييم المطعم والوجبات ومؤشرات الجودة.',
      descriptionEn: 'Monitor restaurant and meal ratings and quality indicators.',
      features: ['F038'],
    },
  },
  {
    path: 'finance/dues',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'المستحقات والعمولات',
      titleEn: 'Dues & commissions',
      descriptionAr: 'تفصيل مستحق كل وجبة والعمولات المطبقة عليها.',
      descriptionEn: 'Review meal payables and the commissions applied to them.',
      features: ['F085', 'F086'],
    },
  },
  {
    path: 'finance/deductions',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'الخصومات والتسويات',
      titleEn: 'Deductions & adjustments',
      descriptionAr: 'مراجعة الخصومات المرتبطة بالشكاوى وأسبابها وقراراتها.',
      descriptionEn: 'Review complaint deductions, reasons, and responsibility decisions.',
      features: ['F087'],
    },
  },
  {
    path: 'finance/invoices',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'الفواتير الشهرية',
      titleEn: 'Monthly invoices',
      descriptionAr: 'عرض الفواتير الشهرية وتفاصيل البنود والحالة المالية.',
      descriptionEn: 'View monthly invoices, line items, and financial status.',
      features: ['F088'],
    },
  },
  {
    path: 'finance/payouts',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'الدفعات والتحويلات',
      titleEn: 'Payouts & transfers',
      descriptionAr: 'متابعة الدفعات الكلية والجزئية وإيصالات التحويل.',
      descriptionEn: 'Track full and partial payouts and transfer receipts.',
      features: ['F089', 'F090', 'F091'],
    },
  },
  {
    path: 'finance/statements',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'كشف الحساب',
      titleEn: 'Account statements',
      descriptionAr: 'عرض الحركات والأرصدة ضمن فترات مالية مقفلة.',
      descriptionEn: 'View transactions and balances for closed financial periods.',
      features: ['F092'],
    },
  },
  {
    path: 'finance/reports',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'التقارير المالية',
      titleEn: 'Financial reports',
      descriptionAr: 'تحليل الإيرادات والمستحقات والخصومات والدفعات.',
      descriptionEn: 'Analyze revenue, dues, deductions, and payouts.',
      features: ['F093'],
    },
  },
  {
    path: 'settings',
    loadComponent: loadFeaturePage,
    data: {
      titleAr: 'إعدادات المطعم',
      titleEn: 'Restaurant settings',
      descriptionAr: 'إدارة بيانات المطعم وإعدادات الحساب وطلبات إنهاء التعاقد.',
      descriptionEn: 'Manage restaurant profile, account settings, and contract termination requests.',
      features: ['F039'],
    },
  },
];
