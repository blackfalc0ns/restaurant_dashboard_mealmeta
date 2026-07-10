import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Urgency of the 24h confirmation window after −72h lock. */
export type ConfirmationUrgency = 'critical' | 'warning' | 'normal' | 'overdue';

export type PendingConfirmationFilter =
  | 'all'
  | ConfirmationUrgency
  | 'confirmed';

export interface PendingConfirmationSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'danger' | 'neutral';
  icon: string;
}

export interface PendingConfirmationItem {
  id: string;
  orderCode: string;
  batchCode: string;
  customerMaskedId: string;
  mealSummary: LocalizedText;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  boxCount: number;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  receivedAtLabel: LocalizedText;
  deadlineLabel: LocalizedText;
  hoursLeft: number;
  urgency: ConfirmationUrgency;
  confirmed: boolean;
  isReassigned: boolean;
  route: string;
}

export interface PendingConfirmationData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  windowHint: LocalizedText;
  summaries: PendingConfirmationSummary[];
  orders: PendingConfirmationItem[];
}
