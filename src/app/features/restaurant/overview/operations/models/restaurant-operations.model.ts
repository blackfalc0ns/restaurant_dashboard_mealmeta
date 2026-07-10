import { LocalizedText } from '../../models/restaurant-overview.model';

export type OpsQueueTone = 'critical' | 'warning' | 'info' | 'ok';

export interface OpsMetric {
  id: string;
  label: LocalizedText;
  value: string;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'danger' | 'neutral';
  icon: string;
  route: string;
}

export interface OpsQueueItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  badge: LocalizedText;
  tone: OpsQueueTone;
  route: string;
}

export interface OpsProgressItem {
  id: string;
  label: LocalizedText;
  valueLabel: LocalizedText;
  percent: number;
  tone: 'ok' | 'warning' | 'danger';
}

export interface OpsTimelineItem {
  id: string;
  title: LocalizedText;
  time: LocalizedText;
}

export interface OpsHourPoint {
  label: LocalizedText;
  inbound: number;
  confirmed: number;
}

export interface RestaurantOperationsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  busy: boolean;
  healthPercent: number;
  healthLabel: LocalizedText;
  metrics: OpsMetric[];
  queue: OpsQueueItem[];
  progress: OpsProgressItem[];
  timeline: OpsTimelineItem[];
  hourly: OpsHourPoint[];
  briefs: Array<{
    id: string;
    label: LocalizedText;
    value: string;
    note: LocalizedText;
  }>;
}
