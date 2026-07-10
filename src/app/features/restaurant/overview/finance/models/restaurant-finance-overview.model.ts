import { LocalizedText } from '../../models/restaurant-overview.model';

export type FinancePeriod = 'month' | 'quarter' | 'year';

export interface FinanceMetric {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
  route: string;
}

export interface FinanceBreakdownItem {
  id: string;
  label: LocalizedText;
  amountKd: number;
  percent: number;
  tone: 'ok' | 'warning' | 'danger' | 'neutral';
}

export interface FinanceMonthPoint {
  label: LocalizedText;
  payable: number;
  payout: number;
}

export interface FinanceTxnItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  amountKd: number;
  direction: 'in' | 'out';
  status: LocalizedText;
  route: string;
}

export interface FinanceQuickLink {
  id: string;
  label: LocalizedText;
  route: string;
  icon: string;
}

export interface RestaurantFinanceOverviewData {
  period: FinancePeriod;
  title: LocalizedText;
  subtitle: LocalizedText;
  metrics: FinanceMetric[];
  breakdown: FinanceBreakdownItem[];
  monthly: FinanceMonthPoint[];
  transactions: FinanceTxnItem[];
  quickLinks: FinanceQuickLink[];
  statementNote: LocalizedText;
}
