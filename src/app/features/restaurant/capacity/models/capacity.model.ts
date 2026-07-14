import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export interface CapacityDaySnapshot {
  id: string;
  dateIso: string;
  weekdayLabel: LocalizedText;
  confirmed: number;
  limit: number;
  busy: boolean;
  isToday: boolean;
}

export interface RestaurantCapacityData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  dailyLimit: number;
  confirmedToday: number;
  nearLimitThreshold: number;
  updatedAtLabel: LocalizedText;
  note: LocalizedText;
  week: CapacityDaySnapshot[];
}
