import { RestaurantNavItem, RestaurantNavSection } from './restaurant-nav.model';

export const RESTAURANT_NAV_SECTIONS: RestaurantNavSection[] = [
  {
    id: 'orders',
    labelAr: 'الطلبات',
    labelEn: 'Orders',
    icon: 'lucideCrosshair',
    items: [
      {
        id: 'all-orders',
        labelAr: 'الكل',
        labelEn: 'All',
        route: '/restaurant/orders/pending-confirmation',
        icon: 'lucideList',
        badge: 4,
      },
      {
        id: 'archived-orders',
        labelAr: 'مؤرشف',
        labelEn: 'Archived',
        route: '/restaurant/setup-wizard',
        icon: 'lucideArchive',
        badge: 0,
      },
      {
        id: 'order-status',
        labelAr: 'الحالة',
        labelEn: 'Status',
        icon: 'lucideCircleDot',
        children: [
          {
            id: 'pending-confirmation',
            labelAr: 'بانتظار التأكيد',
            labelEn: 'Pending confirmation',
            route: '/restaurant/orders/pending-confirmation',
            icon: 'lucideClock',
            badge: 2,
          },
          {
            id: 'upcoming-24h',
            labelAr: 'تحضير 24 ساعة',
            labelEn: 'Upcoming 24h prep',
            route: '/restaurant/orders/upcoming-24h',
            icon: 'lucidePackage',
            badge: 1,
          },
        ],
      },
      {
        id: 'order-prep',
        labelAr: 'التصنيف',
        labelEn: 'Group',
        icon: 'lucideLayers',
        children: [
          {
            id: 'labels',
            labelAr: 'الملصقات والباركود',
            labelEn: 'Labels & barcodes',
            route: '/restaurant/setup-wizard',
            icon: 'lucideQrCode',
            badge: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'operations',
    labelAr: 'التشغيل',
    labelEn: 'Operations',
    icon: 'lucideBriefcase',
    items: [
      {
        id: 'capacity',
        labelAr: 'السعة اليومية',
        labelEn: 'Daily capacity',
        route: '/restaurant/setup-wizard',
        icon: 'lucideGauge',
        badge: 0,
      },
      {
        id: 'menu-pricing',
        labelAr: 'المنيو والأسعار',
        labelEn: 'Menu & pricing',
        route: '/restaurant/setup-wizard',
        icon: 'lucideUtensilsCrossed',
        badge: 0,
      },
    ],
  },
  {
    id: 'finance',
    labelAr: 'المالية',
    labelEn: 'Finance',
    icon: 'lucideWallet',
    items: [
      {
        id: 'settlements',
        labelAr: 'التسويات',
        labelEn: 'Settlements',
        route: '/restaurant/setup-wizard',
        icon: 'lucideReceipt',
        badge: 0,
      },
      {
        id: 'invoices',
        labelAr: 'الفواتير',
        labelEn: 'Invoices',
        route: '/restaurant/setup-wizard',
        icon: 'lucideFileText',
        badge: 0,
      },
    ],
  },
];

export const RESTAURANT_SETTINGS_ITEM: RestaurantNavItem = {
  id: 'settings',
  labelAr: 'الإعدادات',
  labelEn: 'Settings',
  route: '/restaurant/setup-wizard',
  icon: 'lucideSettings',
};
