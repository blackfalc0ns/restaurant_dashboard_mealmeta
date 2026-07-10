import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type LabelPrintStatus = 'ready' | 'printed' | 'missing';

export type LabelsFilter = 'all' | LabelPrintStatus;

export type LabelsShift = 'all' | 'morning' | 'noon' | 'evening';

export interface LabelsSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface LabelJobItem {
  id: string;
  orderCode: string;
  batchCode: string;
  barcodeCode: string | null;
  mealLabel: LocalizedText;
  slotLabel: LocalizedText;
  programLabel: LocalizedText;
  boxCount: number;
  labelCount: number;
  shift: Exclude<LabelsShift, 'all'>;
  shiftLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  status: LabelPrintStatus;
  printedAtLabel: LocalizedText | null;
  route: string;
}

export interface LabelsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  printAllLabel: LocalizedText;
  summaries: LabelsSummary[];
  jobs: LabelJobItem[];
}
