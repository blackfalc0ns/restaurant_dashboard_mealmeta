import { RestaurantAnalyticsData } from '../models/restaurant-analytics.model';

export const RESTAURANT_ANALYTICS_MOCK: RestaurantAnalyticsData = {
  period: '7d',
  title: {
    ar: 'التحليلات والأداء',
    en: 'Analytics & performance',
  },
  subtitle: {
    ar: 'مؤشرات التشغيل والجودة والمالية للأسبوع الحالي',
    en: 'Operations, quality, and finance indicators for the current week',
  },
  metrics: [
    {
      id: 'confirm-rate',
      label: { ar: 'معدل التأكيد في الوقت', en: 'On-time confirmation' },
      value: '94%',
      delta: { ar: '+3.2% عن الأسبوع السابق', en: '+3.2% vs last week' },
      direction: 'up',
      tone: 'primary',
      icon: 'lucideBadgeCheck',
    },
    {
      id: 'orders',
      label: { ar: 'طلبات مؤكدة', en: 'Confirmed orders' },
      value: '126',
      delta: { ar: '+12 طلب', en: '+12 orders' },
      direction: 'up',
      tone: 'accent',
      icon: 'lucideClipboardList',
    },
    {
      id: 'busy',
      label: { ar: 'تكرار Busy', en: 'Busy frequency' },
      value: '2',
      delta: { ar: '−1 عن الأسبوع السابق', en: '−1 vs last week' },
      direction: 'down',
      tone: 'warning',
      icon: 'lucideGauge',
    },
    {
      id: 'handover',
      label: { ar: 'نجاح التسليم', en: 'Handover success' },
      value: '98%',
      delta: { ar: 'مستقر', en: 'Stable' },
      direction: 'flat',
      tone: 'neutral',
      icon: 'lucidePackageCheck',
    },
  ],
  weeklySeries: [
    { label: { ar: 'سبت', en: 'Sat' }, confirmed: 18, delivered: 16 },
    { label: { ar: 'أحد', en: 'Sun' }, confirmed: 22, delivered: 20 },
    { label: { ar: 'إثن', en: 'Mon' }, confirmed: 19, delivered: 18 },
    { label: { ar: 'ثلا', en: 'Tue' }, confirmed: 24, delivered: 22 },
    { label: { ar: 'أرب', en: 'Wed' }, confirmed: 21, delivered: 20 },
    { label: { ar: 'خمي', en: 'Thu' }, confirmed: 17, delivered: 15 },
    { label: { ar: 'جمع', en: 'Fri' }, confirmed: 5, delivered: 4 },
  ],
  topMeals: [
    {
      id: 'meal-1',
      name: { ar: 'وجبة بروتين متوازنة', en: 'Balanced protein bowl' },
      orders: 42,
      sharePercent: 33,
    },
    {
      id: 'meal-2',
      name: { ar: 'سلطة دجاج مشوي', en: 'Grilled chicken salad' },
      orders: 31,
      sharePercent: 25,
    },
    {
      id: 'meal-3',
      name: { ar: 'وجبة منخفضة الكربوهيدرات', en: 'Low-carb plate' },
      orders: 24,
      sharePercent: 19,
    },
    {
      id: 'meal-4',
      name: { ar: 'سموثي أخضر', en: 'Green smoothie' },
      orders: 18,
      sharePercent: 14,
    },
    {
      id: 'meal-5',
      name: { ar: 'وجبة نباتية', en: 'Plant-based meal' },
      orders: 11,
      sharePercent: 9,
    },
  ],
  financeBars: [
    {
      id: 'payable',
      label: { ar: 'مستحق الوجبات', en: 'Meal payables' },
      amountKd: 1260.75,
      percent: 100,
    },
    {
      id: 'commission',
      label: { ar: 'عمولة المطعم', en: 'Restaurant commission' },
      amountKd: 189.1,
      percent: 15,
    },
    {
      id: 'deductions',
      label: { ar: 'خصومات الشكاوى', en: 'Complaint deductions' },
      amountKd: 38.25,
      percent: 3,
    },
    {
      id: 'payout',
      label: { ar: 'صافي السداد', en: 'Net payout' },
      amountKd: 1033.4,
      percent: 82,
    },
  ],
  quality: {
    averageRating: 4.6,
    ratingsCount: 128,
    rows: [
      {
        id: 'taste',
        label: { ar: 'الطعم', en: 'Taste' },
        value: '4.8',
      },
      {
        id: 'packaging',
        label: { ar: 'التعبئة', en: 'Packaging' },
        value: '4.5',
      },
      {
        id: 'freshness',
        label: { ar: 'الطزاجة', en: 'Freshness' },
        value: '4.7',
      },
      {
        id: 'complaints',
        label: { ar: 'شكاوى مفتوحة', en: 'Open complaints' },
        value: '2',
      },
    ],
  },
  insights: [
    {
      id: 'ins-1',
      title: {
        ar: 'ذروة التأكيد يوم الثلاثاء',
        en: 'Confirmation peak on Tuesday',
      },
      detail: {
        ar: '24 طلبًا مؤكدًا — راقب الطاقة قبل الذروة القادمة',
        en: '24 confirmed orders — watch capacity before the next peak',
      },
    },
    {
      id: 'ins-2',
      title: {
        ar: 'وجبة البروتين تقود الطلب',
        en: 'Protein bowl leads demand',
      },
      detail: {
        ar: '33% من الطلبات هذا الأسبوع',
        en: '33% of orders this week',
      },
    },
    {
      id: 'ins-3',
      title: {
        ar: 'خصومات الشكاوى منخفضة',
        en: 'Complaint deductions are low',
      },
      detail: {
        ar: '3% فقط من مستحق الوجبات',
        en: 'Only 3% of meal payables',
      },
    },
  ],
};
