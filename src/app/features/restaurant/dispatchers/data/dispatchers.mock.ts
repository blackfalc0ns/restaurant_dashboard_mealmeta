import {
  RestaurantDispatcher,
  RestaurantDispatchersData,
} from '../models/dispatcher.model';

export const DISPATCHERS_MOCK: RestaurantDispatchersData = {
  title: { ar: 'مسئولو التوصيل', en: 'Dispatch officers' },
  subtitle: {
    ar: 'المطعم ينشئ حسابات مسئولي التوصيل من اللوحة. إنشاء الرحلات يتم من الويب — ليس من تطبيق موبايل منفصل.',
    en: 'The restaurant creates dispatch officer accounts from the dashboard. Trips are created on the web — not a separate mobile app.',
  },
  dateLabel: { ar: 'التوصيل والجودة', en: 'Delivery & quality' },
  note: {
    ar: 'مسئول التوصيل يجمّع البوكسات في رحلة ويع يّن السائق من لوحة المطعم.',
    en: 'The dispatch officer groups boxes into a trip and assigns the driver from the restaurant dashboard.',
  },
  summaries: [
    { id: 'active', label: { ar: 'مفعّلون', en: 'Active' }, value: 2 },
    { id: 'disabled', label: { ar: 'معطّلون', en: 'Disabled' }, value: 1 },
    { id: 'trips', label: { ar: 'رحلات اليوم', en: 'Trips today' }, value: 5 },
  ],
  dispatchers: [
    {
      id: 'dsp-01',
      name: { ar: 'نورة المنصوري', en: 'Noura Al-Mansouri' },
      phone: '+965 5002 1101',
      email: 'noura.dispatch@mealmate.kw',
      status: 'active',
      tripsCreatedToday: 3,
      tripsCreatedWeek: 18,
      updatedAtLabel: { ar: 'آخر نشاط منذ 20 د', en: 'Last active 20m ago' },
      joinedAtLabel: { ar: 'أُضيف 2 فبراير 2026', en: 'Added 2 Feb 2026' },
      timeline: [
        {
          id: 'e1',
          title: { ar: 'أنشأت رحلة TRP-102 وعيّنت سائقًا', en: 'Created trip TRP-102 and assigned a driver' },
          timeLabel: { ar: 'اليوم 14:10', en: 'Today 14:10' },
          tone: 'ok',
        },
        {
          id: 'e2',
          title: { ar: 'أنشأت رحلة TRP-101', en: 'Created trip TRP-101' },
          timeLabel: { ar: 'اليوم 11:20', en: 'Today 11:20' },
          tone: 'ok',
        },
        {
          id: 'e3',
          title: { ar: 'المطعم أنشأ الحساب وفعّله', en: 'Restaurant created and enabled the account' },
          timeLabel: { ar: 'منذ 5 أشهر', en: '5 months ago' },
          tone: 'neutral',
        },
      ],
    },
    {
      id: 'dsp-02',
      name: { ar: 'خالد السبيعي', en: 'Khaled Al-Subai' },
      phone: '+965 5002 1108',
      email: 'khaled.dispatch@mealmate.kw',
      status: 'active',
      tripsCreatedToday: 2,
      tripsCreatedWeek: 14,
      updatedAtLabel: { ar: 'آخر نشاط منذ ساعة', en: 'Last active 1h ago' },
      joinedAtLabel: { ar: 'أُضيف 18 مارس 2026', en: 'Added 18 Mar 2026' },
      timeline: [
        {
          id: 'e1',
          title: { ar: 'أنشأ رحلة TRP-103', en: 'Created trip TRP-103' },
          timeLabel: { ar: 'اليوم 15:05', en: 'Today 15:05' },
          tone: 'ok',
        },
        {
          id: 'e2',
          title: { ar: 'المطعم أنشأ الحساب وفعّله', en: 'Restaurant created and enabled the account' },
          timeLabel: { ar: 'منذ 4 أشهر', en: '4 months ago' },
          tone: 'neutral',
        },
      ],
    },
    {
      id: 'dsp-03',
      name: { ar: 'مريم العتيبي', en: 'Maryam Al-Otaibi' },
      phone: '+965 5002 1115',
      email: 'maryam.dispatch@mealmate.kw',
      status: 'disabled',
      tripsCreatedToday: 0,
      tripsCreatedWeek: 0,
      updatedAtLabel: { ar: 'عُطّل منذ أسبوع', en: 'Disabled 1w ago' },
      joinedAtLabel: { ar: 'أُضيف 5 مايو 2026', en: 'Added 5 May 2026' },
      note: {
        ar: 'معطّل من المطعم — لا يمكنه إنشاء رحلات حتى يُعاد تفعيله.',
        en: 'Disabled by the restaurant — cannot create trips until re-enabled.',
      },
      timeline: [
        {
          id: 'e1',
          title: { ar: 'المطعم عطّل الحساب', en: 'Restaurant disabled the account' },
          timeLabel: { ar: 'منذ أسبوع', en: '1w ago' },
          tone: 'warn',
        },
        {
          id: 'e2',
          title: { ar: 'المطعم أنشأ الحساب وفعّله', en: 'Restaurant created and enabled the account' },
          timeLabel: { ar: 'منذ شهرين', en: '2 months ago' },
          tone: 'neutral',
        },
      ],
    },
  ] satisfies RestaurantDispatcher[],
};
