import { RestaurantCapacityData } from '../models/capacity.model';

function day(
  offset: number,
  confirmed: number,
  limit: number,
): RestaurantCapacityData['week'][number] {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);

  const iso = date.toISOString().slice(0, 10);
  const weekdayAr = new Intl.DateTimeFormat('ar-KW', { weekday: 'short' }).format(
    date,
  );
  const weekdayEn = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
    date,
  );

  return {
    id: iso,
    dateIso: iso,
    weekdayLabel: { ar: weekdayAr, en: weekdayEn },
    confirmed,
    limit,
    busy: confirmed >= limit,
    isToday: offset === 0,
  };
}

export const CAPACITY_MOCK: RestaurantCapacityData = {
  title: { ar: 'السعة اليومية', en: 'Daily capacity' },
  subtitle: {
    ar: 'حدّد أقصى بوكسات يوميًا. الطلبات المؤكدة فقط تُحتسب، وعند بلوغ الحد يصبح المطعم Busy لهذا اليوم.',
    en: 'Set your max daily boxes. Only confirmed orders count, and reaching the limit marks the restaurant Busy for that day.',
  },
  dateLabel: { ar: 'الإعدادات التشغيلية', en: 'Operations settings' },
  dailyLimit: 120,
  confirmedToday: 98,
  nearLimitThreshold: 0.85,
  updatedAtLabel: { ar: 'آخر تحديث منذ 8 دقائق', en: 'Updated 8 min ago' },
  note: {
    ar: 'خفض الحد بعد استقبال طلبات لا يلغي الطلبات المؤكدة سابقًا.',
    en: 'Lowering the limit after confirmations does not cancel confirmed orders.',
  },
  week: [
    day(-3, 110, 120),
    day(-2, 120, 120),
    day(-1, 95, 120),
    day(0, 98, 120),
    day(1, 42, 120),
    day(2, 18, 120),
    day(3, 0, 120),
  ],
};
