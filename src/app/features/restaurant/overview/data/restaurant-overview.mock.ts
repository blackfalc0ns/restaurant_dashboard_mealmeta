import { RestaurantOverviewData } from '../models/restaurant-overview.model';

export const RESTAURANT_OVERVIEW_MOCK: RestaurantOverviewData = {
  restaurantName: {
    ar: 'مطعم الشريك الصحي',
    en: 'Healthy Partner Kitchen',
  },
  generatedAt: new Date().toISOString(),
  status: {
    status: 'active',
    title: {
      ar: 'المطعم نشط وجاهز للتشغيل',
      en: 'Restaurant is active and ready',
    },
    subtitle: {
      ar: 'نافذة 72 ساعة مفتوحة — أكّد الطلبات العاجلة قبل انتهاء المهلة.',
      en: 'The 72h window is open — confirm urgent orders before the deadline.',
    },
    checklist: [
      { id: 'menu', label: { ar: 'قائمة معتمدة', en: 'Approved menu' }, done: true },
      {
        id: 'regions',
        label: { ar: 'مناطق خدمة', en: 'Service regions' },
        done: true,
      },
      {
        id: 'capacity',
        label: { ar: 'طاقة يومية', en: 'Daily capacity' },
        done: true,
      },
      {
        id: 'pricing',
        label: { ar: 'أسعار محدّثة', en: 'Updated pricing' },
        done: false,
      },
    ],
    busyUntil: null,
  },
  kpis: [
    {
      id: 'pending-72h',
      label: { ar: 'بانتظار التأكيد', en: 'Pending confirmation' },
      value: 2,
      trendLabel: { ar: 'خلال 6 ساعات', en: 'Within 6 hours' },
      trendDirection: 'up',
      tone: 'accent',
      route: '/restaurant/orders/pending-confirmation',
      sparkline: [1, 2, 1, 3, 2, 2, 2],
    },
    {
      id: 'orders-today',
      label: { ar: 'طلبات اليوم', en: 'Orders today' },
      value: 18,
      trendLabel: { ar: '+3 عن أمس', en: '+3 vs yesterday' },
      trendDirection: 'up',
      tone: 'primary',
      route: '/restaurant/orders/daily',
      sparkline: [12, 14, 15, 13, 16, 15, 18],
    },
    {
      id: 'upcoming-24h',
      label: { ar: 'تحضير 24 ساعة', en: 'Upcoming 24h prep' },
      value: 1,
      trendLabel: { ar: 'ملصقات جاهزة', en: 'Labels ready' },
      trendDirection: 'flat',
      tone: 'warning',
      route: '/restaurant/orders/upcoming-24h',
      sparkline: [0, 1, 2, 1, 1, 0, 1],
    },
    {
      id: 'handover-pending',
      label: { ar: 'تسليم معلّق', en: 'Handover pending' },
      value: 3,
      trendLabel: { ar: 'سائقون في الطريق', en: 'Drivers en route' },
      trendDirection: 'down',
      tone: 'neutral',
      route: '/restaurant/orders/handover',
      sparkline: [5, 4, 4, 3, 4, 3, 3],
    },
  ],
  urgentOrders: [
    {
      id: 'ord-7201',
      deliveryDateLabel: {
        ar: 'التسليم بعد غد · 13 يوليو',
        en: 'Delivery in 2 days · 13 Jul',
      },
      mealCount: 26,
      programLabel: { ar: 'برنامج لياقة · بلاتينيوم', en: 'Fitness · Platinum' },
      countdownHours: 4,
      countdownState: 'critical',
      route: '/restaurant/orders/pending-confirmation',
    },
    {
      id: 'ord-7202',
      deliveryDateLabel: {
        ar: 'التسليم بعد يومين · 14 يوليو',
        en: 'Delivery in 3 days · 14 Jul',
      },
      mealCount: 18,
      programLabel: { ar: 'برنامج رشاقة · أساسي', en: 'Slim · Basic' },
      countdownHours: 11,
      countdownState: 'warning',
      route: '/restaurant/orders/pending-confirmation',
    },
    {
      id: 'ord-7203',
      deliveryDateLabel: {
        ar: 'التسليم بعد 3 أيام · 15 يوليو',
        en: 'Delivery in 4 days · 15 Jul',
      },
      mealCount: 12,
      programLabel: { ar: 'برنامج توازن · نخبة', en: 'Balance · Elite' },
      countdownHours: 20,
      countdownState: 'ok',
      route: '/restaurant/orders/pending-confirmation',
    },
  ],
  capacity: {
    used: 42,
    capacity: 60,
    utilizationPercent: 70,
    busy: false,
    weeklyUtilization: [55, 62, 48, 71, 68, 70, 70],
    weekdayLabels: [
      { ar: 'سبت', en: 'Sat' },
      { ar: 'أحد', en: 'Sun' },
      { ar: 'إثن', en: 'Mon' },
      { ar: 'ثلا', en: 'Tue' },
      { ar: 'أرب', en: 'Wed' },
      { ar: 'خمي', en: 'Thu' },
      { ar: 'جمع', en: 'Fri' },
    ],
  },
  finance: {
    pendingPayoutKd: 482.5,
    lastInvoiceLabel: {
      ar: 'فاتورة يونيو 2026',
      en: 'June 2026 invoice',
    },
    lastInvoiceAmountKd: 1260.75,
    deductionsKd: 38.25,
    monthTrend: [820, 910, 880, 1040, 1120, 1260],
  },
  quality: {
    averageRating: 4.6,
    ratingsCount: 128,
    openComplaints: 2,
    responseSlaHours: 18,
  },
  activity: [
    {
      id: 'act-1',
      severity: 'critical',
      title: {
        ar: 'طلب يحتاج تأكيد خلال 4 ساعات',
        en: 'Order needs confirmation within 4 hours',
      },
      detail: {
        ar: '26 وجبة · برنامج لياقة',
        en: '26 meals · Fitness program',
      },
      timeLabel: { ar: 'الآن', en: 'Just now' },
      route: '/restaurant/orders/pending-confirmation',
    },
    {
      id: 'act-2',
      severity: 'warning',
      title: {
        ar: 'شكوى بانتظار رد المطعم',
        en: 'Complaint awaiting restaurant reply',
      },
      detail: {
        ar: 'جودة الوجبة · رقم CMP-441',
        en: 'Meal quality · CMP-441',
      },
      timeLabel: { ar: 'منذ ساعة', en: '1h ago' },
      route: '/restaurant/overview/quality',
    },
    {
      id: 'act-3',
      severity: 'info',
      title: {
        ar: 'تحضير 24 ساعة جاهز للطباعة',
        en: '24h prep ready for print',
      },
      detail: {
        ar: 'ملصقات وباركود لطلب واحد',
        en: 'Labels & barcodes for 1 order',
      },
      timeLabel: { ar: 'منذ 3 ساعات', en: '3h ago' },
      route: '/restaurant/orders/upcoming-24h',
    },
    {
      id: 'act-4',
      severity: 'success',
      title: {
        ar: 'تم تسجيل دفعة جزئية',
        en: 'Partial payout recorded',
      },
      detail: {
        ar: '182.000 د.ك · إيصال تحويل',
        en: '182.000 KD · Transfer receipt',
      },
      timeLabel: { ar: 'أمس', en: 'Yesterday' },
      route: '/restaurant/finance/payouts',
    },
    {
      id: 'act-5',
      severity: 'info',
      title: {
        ar: 'تقييم جديد على وجبة البروتين',
        en: 'New rating on protein meal',
      },
      detail: {
        ar: '5 نجوم · تعليق إيجابي',
        en: '5 stars · Positive feedback',
      },
      timeLabel: { ar: 'أمس', en: 'Yesterday' },
      route: '/restaurant/quality/ratings',
    },
    {
      id: 'act-6',
      severity: 'warning',
      title: {
        ar: 'الطاقة اقتربت من الحد',
        en: 'Capacity nearing limit',
      },
      detail: {
        ar: '70% من السعة اليومية مستخدمة',
        en: '70% of daily capacity used',
      },
      timeLabel: { ar: 'اليوم', en: 'Today' },
      route: '/restaurant/operations/capacity',
    },
  ],
  quickActions: [
    {
      id: 'confirm',
      label: { ar: 'تأكيد الطلبات', en: 'Confirm orders' },
      route: '/restaurant/orders/pending-confirmation',
      icon: 'lucideClock',
    },
    {
      id: 'labels',
      label: { ar: 'طباعة الملصقات', en: 'Print labels' },
      route: '/restaurant/orders/labels',
      icon: 'lucideQrCode',
    },
    {
      id: 'archive',
      label: { ar: 'أرشيف الطلبات', en: 'Orders archive' },
      route: '/restaurant/orders/archive',
      icon: 'lucideArchive',
    },
    {
      id: 'capacity',
      label: { ar: 'تعديل الطاقة', en: 'Adjust capacity' },
      route: '/restaurant/operations/capacity',
      icon: 'lucideGauge',
    },
    {
      id: 'finance',
      label: { ar: 'المستحقات', en: 'View dues' },
      route: '/restaurant/finance/dues',
      icon: 'lucideWallet',
    },
  ],
};
