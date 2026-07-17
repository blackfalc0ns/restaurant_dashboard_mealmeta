import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant-facing dues (box payables) and MealMate restaurant commission.
 * Settlement is calculated per delivered box, not per meal. */
export type DueStatus = 'pending' | 'scheduled' | 'paid' | 'held';

export type DueKind = 'box_payable' | 'commission' | 'net_settlement';

export type DueFilter = 'all' | DueStatus;

export interface DueSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
}

export interface DueTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
}

export interface DueDeliveryDay {
  id: string;
  dateLabel: LocalizedText;
  boxes: number;
  amountKd: number;
}

/** One delivered restaurant box contributing to a due line. No customer PII.
 * Pricing/commission are per box. */
export interface DueBox {
  id: string;
  boxCode: string;
  orderCode: string;
  customerMaskedId: string;
  /** Contents label for the box (informational only — settlement is per box). */
  contentsLabel: LocalizedText;
  zoneLabel: LocalizedText;
  deliveredAtLabel: LocalizedText;
  /** Agreed restaurant box price before commission. */
  unitPriceKd: number;
  commissionKd: number;
  netKd: number;
}

export interface DueLine {
  id: string;
  code: string;
  kind: DueKind;
  status: DueStatus;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  boxesDelivered: number;
  /** Gross restaurant box amount before commission. */
  grossKd: number;
  /** Restaurant commission deducted by MealMate (not customer subscription commission). */
  commissionKd: number;
  commissionRatePct: number;
  /** Net amount after commission (before complaint deductions on other pages). */
  netKd: number;
  updatedAtLabel: LocalizedText;
  transferRef?: string;
  note?: LocalizedText;
  deliveryDays?: DueDeliveryDay[];
  boxes?: DueBox[];
  timeline: DueTimelineEvent[];
}

export interface RestaurantDuesData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  commissionNote: LocalizedText;
  agreementRatePct: number;
  summaries: DueSummary[];
  lines: DueLine[];
}
