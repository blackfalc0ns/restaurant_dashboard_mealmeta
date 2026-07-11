import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Driver handover lifecycle after kitchen prep / labels are ready. */
export type HandoverStatus =
  | 'awaiting-pickup'
  | 'en-route'
  | 'delivered';

export type HandoverFilter = 'all' | HandoverStatus;

export type HandoverShift = 'all' | 'morning' | 'noon' | 'evening';

export interface HandoverSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface HandoverListItem {
  id: string;
  orderCode: string;
  batchCode: string;
  customerMaskedId: string;
  driverCode: string;
  barcodeCode: string;
  mealSummary: LocalizedText;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  boxCount: number;
  shift: Exclude<HandoverShift, 'all'>;
  shiftLabel: LocalizedText;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  status: HandoverStatus;
  statusHint: LocalizedText;
  pickedUpAtLabel: LocalizedText | null;
  etaLabel: LocalizedText;
  route: string;
}

export interface HandoverListData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  windowHint: LocalizedText;
  summaries: HandoverSummary[];
  orders: HandoverListItem[];
}

export interface HandoverMealItem {
  id: string;
  slotLabel: LocalizedText;
  mealName: LocalizedText;
  calories: number;
  proteinGrams: number;
  barcodeCode: string;
  allergenNote: LocalizedText | null;
}

export interface HandoverBoxScan {
  id: string;
  boxIndex: number;
  boxLabel: LocalizedText;
  boxBarcode: string;
  invoiceCode: string;
  mealCount: number;
  pickupScanned: boolean;
  deliveryScanned: boolean;
  pickupAtLabel: LocalizedText | null;
  deliveryAtLabel: LocalizedText | null;
  meals: HandoverMealItem[];
}

export interface HandoverTimelineItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  time: LocalizedText;
  tone: 'critical' | 'warning' | 'info' | 'success';
  done: boolean;
}

export interface HandoverFact {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  icon: string;
}

export interface HandoverChecklistItem {
  id: string;
  label: LocalizedText;
  done: boolean;
  hint: LocalizedText;
}

export interface HandoverDriverInfo {
  code: string;
  vehicleLabel: LocalizedText;
  bagsLabel: LocalizedText;
  zoneLabel: LocalizedText;
  lastPingLabel: LocalizedText;
  contactRule: LocalizedText;
}

export interface HandoverDetailData {
  id: string;
  orderCode: string;
  batchCode: string;
  status: HandoverStatus;
  customerMaskedId: string;
  driverCode: string;
  barcodeCode: string;
  mealSummary: LocalizedText;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  tierLabel: LocalizedText;
  boxCount: number;
  shiftLabel: LocalizedText;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  deliveryZoneLabel: LocalizedText;
  etaLabel: LocalizedText;
  pickedUpAtLabel: LocalizedText | null;
  privacyNote: LocalizedText;
  pickupHint: LocalizedText;
  driver: HandoverDriverInfo;
  facts: HandoverFact[];
  checklist: HandoverChecklistItem[];
  boxes: HandoverBoxScan[];
  timeline: HandoverTimelineItem[];
  labelsRoute: string;
  listRoute: string;
  orderDetailRoute: string;
}
