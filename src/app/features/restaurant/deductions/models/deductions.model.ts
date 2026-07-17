import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant-facing complaint deductions and settlement adjustments.
 * Deducted from restaurant box payables — not customer subscription commission. */
export type DeductionStatus = 'pending' | 'applied' | 'disputed' | 'reversed';

export type DeductionKind = 'complaint' | 'quality' | 'remake' | 'adjustment';

export type DeductionFilter = 'all' | DeductionStatus;

export interface DeductionSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
}

export interface DeductionTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
  detail?: LocalizedText;
}

/** Box affected by a deduction. No customer PII. */
export interface DeductionBox {
  id: string;
  boxCode: string;
  orderCode: string;
  customerMaskedId: string;
  contentsLabel: LocalizedText;
  zoneLabel: LocalizedText;
  deliveredAtLabel: LocalizedText;
  unitPriceKd: number;
  deductedKd: number;
}

export interface DeductionLine {
  id: string;
  code: string;
  kind: DeductionKind;
  status: DeductionStatus;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  complaintCode?: string;
  /** Linked restaurant payable / due line code. */
  linkedDueCode?: string;
  /** Route id for the linked due detail page. */
  linkedDueId?: string;
  boxesAffected: number;
  /** Gross box amount related to the deduction. */
  grossKd: number;
  /** Amount deducted from restaurant settlement. */
  amountKd: number;
  /** Share of related gross covered by the deduction (0–100). */
  coveragePct?: number;
  openedAtLabel?: LocalizedText;
  updatedAtLabel: LocalizedText;
  reason?: LocalizedText;
  impactNote?: LocalizedText;
  nextAction?: LocalizedText;
  decidedBy?: LocalizedText;
  note?: LocalizedText;
  boxes?: DeductionBox[];
  timeline: DeductionTimelineEvent[];
}

export interface RestaurantDeductionsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: DeductionSummary[];
  lines: DeductionLine[];
}
