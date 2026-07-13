import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Closed-order outcomes kept in restaurant archive. */
export type ArchiveStatus = 'delivered' | 'cancelled' | 'complaint';

export type ArchiveFilter = 'all' | ArchiveStatus;

export type ArchiveShift = 'all' | 'morning' | 'noon' | 'evening';

export type ArchivePeriod = 'all' | 'today' | 'week' | 'month';

export interface ArchiveSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface ArchiveOrderItem {
  id: string;
  orderCode: string;
  batchCode: string;
  customerMaskedId: string;
  driverCode: string | null;
  barcodeCode: string | null;
  mealSummary: LocalizedText;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  boxCount: number;
  shift: Exclude<ArchiveShift, 'all'>;
  shiftLabel: LocalizedText;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  closedAtLabel: LocalizedText;
  period: Exclude<ArchivePeriod, 'all'>;
  status: ArchiveStatus;
  statusHint: LocalizedText;
  settlementLabel: LocalizedText;
  ratingLabel: LocalizedText | null;
  route: string;
}

export interface ArchiveData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  windowHint: LocalizedText;
  summaries: ArchiveSummary[];
  orders: ArchiveOrderItem[];
}
