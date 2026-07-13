import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type RestaurantTier = 'basic' | 'platinum' | 'elite';

export type PricingRowStatus = 'configured' | 'missing';

export type PricingFilter = 'all' | PricingRowStatus;

export type PricingScope = 'boxes' | 'meals';

export type PricingProgramFilter = 'all' | string;

export type PricingBundleFilter = 'all' | string;

export interface PricingSummary {
  id: string;
  label: LocalizedText;
  value: number | string;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface PricingRow {
  id: string;
  programId: string;
  programLabel: LocalizedText;
  bundleId: string;
  bundleLabel: LocalizedText;
  status: PricingRowStatus;
  price26DaysKd: number | null;
  dailyBoxPriceKd: number | null;
  tier: RestaurantTier | null;
  tierContextLabel: LocalizedText;
  settlementCommissionPct: number;
  netDailyBoxKd: number | null;
  updatedAtLabel: LocalizedText;
}

export interface RestaurantPricingData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  menuLinkLabel: LocalizedText;
  menuRoute: string;
  settlementCommissionPct: number;
  summaries: PricingSummary[];
  rows: PricingRow[];
}
