import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type DailyOrderStatus =
  | 'preparing'
  | 'ready'
  | 'waiting-driver'
  | 'completed';

export type DailyOrderFilter = 'all' | DailyOrderStatus;

export type DailyShift = 'all' | 'morning' | 'noon' | 'evening';

export interface DailyOrderSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface DailyOrderItem {
  id: string;
  orderCode: string;
  batchCode: string;
  mealName: LocalizedText;
  programLabel: LocalizedText;
  boxCount: number;
  shift: Exclude<DailyShift, 'all'>;
  shiftLabel: LocalizedText;
  status: DailyOrderStatus;
  driverLabel: LocalizedText | null;
  windowLabel: LocalizedText;
  barcodeReady: boolean;
  actionLabel: LocalizedText;
  route: string;
}

export interface DailyOrdersData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  printLabel: LocalizedText;
  summaries: DailyOrderSummary[];
  orders: DailyOrderItem[];
}
