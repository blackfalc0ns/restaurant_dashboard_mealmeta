import { LocalizedText } from '../../../overview/models/restaurant-overview.model';
import { DailyOrderStatus, DailyShift } from '../../models/daily-orders.model';

/** Slot types inside a daily subscription box (F02 Meal Packages). */
export type BoxMealSlot =
  | 'breakfast'
  | 'main'
  | 'snack'
  | 'salad'
  | 'juice';

/** Customer subscription bundle that defines box composition. */
export type SubscriptionBundleKind = 'full' | 'lunch' | 'custom';

export interface OrderDetailFact {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  icon: string;
}

export interface BoxMealIngredient {
  id: string;
  name: LocalizedText;
  amount: LocalizedText;
  allergen?: boolean;
}

export interface BoxMealItem {
  id: string;
  slot: BoxMealSlot;
  slotLabel: LocalizedText;
  slotIndex: number;
  name: LocalizedText;
  description: LocalizedText;
  calories: number;
  proteinGrams: number;
  ingredients: BoxMealIngredient[];
  allergyFlags: LocalizedText[];
  prepNote: LocalizedText;
}

export interface BoxSlotSummary {
  slot: BoxMealSlot;
  label: LocalizedText;
  expected: number;
  filled: number;
}

export interface OrderDetailChecklistItem {
  id: string;
  label: LocalizedText;
  done: boolean;
  hint: LocalizedText;
}

export interface OrderDetailTimelineItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  time: LocalizedText;
  tone: 'critical' | 'warning' | 'info' | 'success';
}

export interface OrderDetailAction {
  id: string;
  label: LocalizedText;
  route: string;
  primary?: boolean;
  icon: string;
}

export interface OrderDetailData {
  id: string;
  orderCode: string;
  batchCode: string;
  status: DailyOrderStatus;
  shift: Exclude<DailyShift, 'all'>;
  shiftLabel: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  customerMaskedId: string;
  deliveryDateLabel: LocalizedText;
  deliverySlotLabel: LocalizedText;
  programLabel: LocalizedText;
  tierLabel: LocalizedText;
  /** Subscription bundle that owns this box composition (F02). */
  bundleKind: SubscriptionBundleKind;
  bundleLabel: LocalizedText;
  boxCompositionLabel: LocalizedText;
  boxCount: number;
  driverCode: string | null;
  barcodeCode: string | null;
  windowLabel: LocalizedText;
  privacyNote: LocalizedText;
  facts: OrderDetailFact[];
  slotSummary: BoxSlotSummary[];
  meals: BoxMealItem[];
  checklist: OrderDetailChecklistItem[];
  timeline: OrderDetailTimelineItem[];
  actions: OrderDetailAction[];
}
