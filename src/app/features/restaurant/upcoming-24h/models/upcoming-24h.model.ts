import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Prep readiness for −24h final preparation window. */
export type Upcoming24hPrepStatus =
  | 'needs-docs'
  | 'preparing'
  | 'docs-ready'
  | 'ready';

export type Upcoming24hFilter = 'all' | Upcoming24hPrepStatus;

export type Upcoming24hShift = 'all' | 'morning' | 'noon' | 'evening';

export interface Upcoming24hSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface Upcoming24hItem {
  id: string;
  orderCode: string;
  batchCode: string;
  customerMaskedId: string;
  mealSummary: LocalizedText;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  boxCount: number;
  shift: Exclude<Upcoming24hShift, 'all'>;
  shiftLabel: LocalizedText;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  hoursToDelivery: number;
  invoiceGenerated: boolean;
  barcodeGenerated: boolean;
  labelsGenerated: boolean;
  prepStatus: Upcoming24hPrepStatus;
  route: string;
  labelsRoute: string;
}

export interface Upcoming24hData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  windowHint: LocalizedText;
  printLabel: LocalizedText;
  summaries: Upcoming24hSummary[];
  orders: Upcoming24hItem[];
}
