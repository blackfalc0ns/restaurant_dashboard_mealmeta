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

/** Single printable meal sticker inside a box. */
export interface MealLabelSticker {
  id: string;
  slotLabel: LocalizedText;
  mealName: LocalizedText;
  calories: number;
  proteinGrams: number;
  allergenNote: LocalizedText | null;
  barcodeCode: string;
}

/** Box invoice for driver pickup/delivery scan. */
export interface BoxInvoice {
  invoiceCode: string;
  /** Payload encoded in the invoice QR for driver scan. */
  qrPayload: string;
  boxBarcode: string;
  mealCount: number;
  amountLabel: LocalizedText;
  scanHint: LocalizedText;
}

/** One physical box: invoice (QR) + meal labels. */
export interface OrderBoxPack {
  id: string;
  boxIndex: number;
  boxLabel: LocalizedText;
  invoice: BoxInvoice;
  stickers: MealLabelSticker[];
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
  deliveryDateLabel: LocalizedText;
  status: LabelPrintStatus;
  printedAtLabel: LocalizedText | null;
  route: string;
  /** @deprecated use boxes[].stickers — kept for list counts */
  stickers: MealLabelSticker[];
  boxes: OrderBoxPack[];
}

export interface LabelsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  printAllLabel: LocalizedText;
  summaries: LabelsSummary[];
  jobs: LabelJobItem[];
}
