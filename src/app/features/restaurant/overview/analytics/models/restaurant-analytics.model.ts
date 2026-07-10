import { LocalizedText } from '../../models/restaurant-overview.model';

export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface AnalyticsMetric {
  id: string;
  label: LocalizedText;
  value: string;
  delta: LocalizedText;
  direction: 'up' | 'down' | 'flat';
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface AnalyticsSeriesPoint {
  label: LocalizedText;
  confirmed: number;
  delivered: number;
}

export interface AnalyticsTopMeal {
  id: string;
  name: LocalizedText;
  orders: number;
  sharePercent: number;
}

export interface AnalyticsFinanceBar {
  id: string;
  label: LocalizedText;
  amountKd: number;
  percent: number;
}

export interface AnalyticsQualityBreakdown {
  averageRating: number;
  ratingsCount: number;
  rows: Array<{
    id: string;
    label: LocalizedText;
    value: string;
  }>;
}

export interface RestaurantAnalyticsData {
  period: AnalyticsPeriod;
  title: LocalizedText;
  subtitle: LocalizedText;
  metrics: AnalyticsMetric[];
  weeklySeries: AnalyticsSeriesPoint[];
  topMeals: AnalyticsTopMeal[];
  financeBars: AnalyticsFinanceBar[];
  quality: AnalyticsQualityBreakdown;
  insights: Array<{
    id: string;
    title: LocalizedText;
    detail: LocalizedText;
  }>;
}
