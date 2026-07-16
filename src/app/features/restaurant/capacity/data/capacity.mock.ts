import { OPS_CAPACITY_SEED } from '../../data/ops-capacity.seed';
import { BusyKind, CapacityDaySnapshot, RestaurantCapacityData } from '../models/capacity.model';

function formatDateLabel(date: Date): { ar: string; en: string } {
  return {
    ar: new Intl.DateTimeFormat('ar-KW', {
      day: 'numeric',
      month: 'short',
    }).format(date),
    en: new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
    }).format(date),
  };
}

function resolveBusy(
  confirmed: number,
  limit: number,
  manualBusy: boolean,
): { busy: boolean; busyKind: BusyKind } {
  if (manualBusy) return { busy: true, busyKind: 'manual' };
  if (limit > 0 && confirmed >= limit) return { busy: true, busyKind: 'capacity' };
  return { busy: false, busyKind: 'none' };
}

function day(
  offset: number,
  confirmed: number,
  limit: number,
  manualBusy = false,
): CapacityDaySnapshot {
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
  const { busy, busyKind } = resolveBusy(confirmed, limit, manualBusy);

  return {
    id: iso,
    dateIso: iso,
    weekdayLabel: { ar: weekdayAr, en: weekdayEn },
    dateLabel: formatDateLabel(date),
    confirmed,
    limit,
    busy,
    busyKind,
    manualBusy,
    isToday: offset === 0,
    isPast: offset < 0,
    canToggleManual: offset >= 0,
  };
}

const todaySeed =
  OPS_CAPACITY_SEED.days.find((d) => d.offset === 0) ?? OPS_CAPACITY_SEED.days[0];

const manualBusySet = new Set<number>(OPS_CAPACITY_SEED.manualBusyOffsets);

export const CAPACITY_MOCK: RestaurantCapacityData = {
  title: { ar: 'السعة والتوفر', en: 'Capacity & availability' },
  subtitle: {
    ar: 'حدّد أقصى بوكسات يوميًا، وفعّل الانشغال يدويًا عند الحاجة لمنع اختيار المطعم.',
    en: 'Set your max daily boxes, and mark manual Busy when you need to stop new selections.',
  },
  dateLabel: { ar: 'الإعدادات التشغيلية', en: 'Operations settings' },
  dailyLimit: OPS_CAPACITY_SEED.dailyLimit,
  confirmedToday: todaySeed.confirmed,
  nearLimitThreshold: OPS_CAPACITY_SEED.nearLimitThreshold,
  updatedAtLabel: { ar: 'آخر تحديث منذ 8 دقائق', en: 'Updated 8 min ago' },
  capacityNote: {
    ar: 'يمكن زيادة السعة اليومية في أي وقت، ولا يمكن تقليلها عن الحد الحالي.',
    en: 'Daily capacity can be increased at any time and cannot be reduced below its current limit.',
  },
  busyNote: {
    ar: 'الانشغال اليدوي يمنع الاختيار لذلك اليوم. الانشغال التلقائي يظهر عند امتلاء السعة ولا يُلغى إلا بزيادة الحد.',
    en: 'Manual Busy blocks selection for that day. Auto Busy appears when capacity is full and clears only by raising the limit.',
  },
  days: OPS_CAPACITY_SEED.days.map((d) =>
    day(
      d.offset,
      d.confirmed,
      OPS_CAPACITY_SEED.dailyLimit,
      manualBusySet.has(d.offset),
    ),
  ),
};
