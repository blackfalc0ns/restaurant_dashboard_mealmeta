export type RestaurantOperationalStatus =
  | 'active'
  | 'needs_setup'
  | 'busy'
  | 'suspended';

export type OverviewAlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface OverviewStatusBanner {
  status: RestaurantOperationalStatus;
  title: LocalizedText;
  subtitle: LocalizedText;
  checklist: Array<{
    id: string;
    label: LocalizedText;
    done: boolean;
  }>;
  busyUntil?: string | null;
}

export interface OverviewKpi {
  id: string;
  label: LocalizedText;
  value: number;
  unit?: LocalizedText;
  trendLabel: LocalizedText;
  trendDirection: 'up' | 'down' | 'flat';
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  route: string;
  sparkline: number[];
}

export interface OverviewUrgentOrder {
  id: string;
  deliveryDateLabel: LocalizedText;
  mealCount: number;
  programLabel: LocalizedText;
  countdownHours: number;
  countdownState: 'critical' | 'warning' | 'ok';
  route: string;
}

export interface OverviewCapacitySnapshot {
  used: number;
  capacity: number;
  utilizationPercent: number;
  busy: boolean;
  weeklyUtilization: number[];
  weekdayLabels: LocalizedText[];
}

export interface OverviewFinanceSnapshot {
  pendingPayoutKd: number;
  lastInvoiceLabel: LocalizedText;
  lastInvoiceAmountKd: number;
  deductionsKd: number;
  monthTrend: number[];
}

export interface OverviewQualitySnapshot {
  averageRating: number;
  ratingsCount: number;
  openComplaints: number;
  responseSlaHours: number;
}

export interface OverviewActivityItem {
  id: string;
  severity: OverviewAlertSeverity;
  title: LocalizedText;
  detail: LocalizedText;
  timeLabel: LocalizedText;
  route: string;
}

export interface OverviewQuickAction {
  id: string;
  label: LocalizedText;
  route: string;
  icon: string;
}

export interface RestaurantOverviewData {
  restaurantName: LocalizedText;
  generatedAt: string;
  status: OverviewStatusBanner;
  kpis: OverviewKpi[];
  urgentOrders: OverviewUrgentOrder[];
  capacity: OverviewCapacitySnapshot;
  finance: OverviewFinanceSnapshot;
  quality: OverviewQualitySnapshot;
  activity: OverviewActivityItem[];
  quickActions: OverviewQuickAction[];
}
