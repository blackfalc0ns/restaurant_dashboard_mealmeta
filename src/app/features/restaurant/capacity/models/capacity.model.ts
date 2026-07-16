import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type BusyKind = 'none' | 'capacity' | 'manual';

export interface CapacityDaySnapshot {
  id: string;
  dateIso: string;
  weekdayLabel: LocalizedText;
  dateLabel: LocalizedText;
  confirmed: number;
  limit: number;
  /** True when capacity full or manual Busy is on. */
  busy: boolean;
  busyKind: BusyKind;
  manualBusy: boolean;
  isToday: boolean;
  isPast: boolean;
  canToggleManual: boolean;
}

export interface RestaurantCapacityData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  dailyLimit: number;
  confirmedToday: number;
  nearLimitThreshold: number;
  updatedAtLabel: LocalizedText;
  capacityNote: LocalizedText;
  busyNote: LocalizedText;
  days: CapacityDaySnapshot[];
}
