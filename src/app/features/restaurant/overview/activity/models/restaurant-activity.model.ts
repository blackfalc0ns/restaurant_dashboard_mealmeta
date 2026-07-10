import { LocalizedText } from '../../models/restaurant-overview.model';

export type ActivitySeverity = 'critical' | 'warning' | 'info' | 'success';
export type ActivityFilter = 'all' | 'critical' | 'ops' | 'finance' | 'quality';
export type ActivityCategory = 'ops' | 'finance' | 'quality';

export interface ActivitySummaryCard {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: ActivitySeverity;
  icon: string;
}

export interface ActivityMetaChip {
  label: LocalizedText;
}

export interface ActivityFeedItem {
  id: string;
  refCode: string;
  severity: ActivitySeverity;
  category: ActivityCategory;
  title: LocalizedText;
  detail: LocalizedText;
  impact: LocalizedText;
  timeLabel: LocalizedText;
  slaLabel: LocalizedText | null;
  owner: LocalizedText;
  actionLabel: LocalizedText;
  route: string;
  icon: string;
  chips: ActivityMetaChip[];
}

export interface ActivityTimelineItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  time: LocalizedText;
  severity: ActivitySeverity;
}

export interface ActivityQuickLink {
  id: string;
  label: LocalizedText;
  hint: LocalizedText;
  route: string;
  icon: string;
  tone: ActivitySeverity;
  count?: number;
}

export interface RestaurantActivityData {
  title: LocalizedText;
  subtitle: LocalizedText;
  attention: {
    title: LocalizedText;
    detail: LocalizedText;
    route: string;
    actionLabel: LocalizedText;
  };
  summaries: ActivitySummaryCard[];
  feed: ActivityFeedItem[];
  timeline: ActivityTimelineItem[];
  quickLinks: ActivityQuickLink[];
}
