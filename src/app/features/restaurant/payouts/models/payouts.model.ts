import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant payouts / bank transfers for settlement nets.
 * Funded from delivered-box payables after restaurant commission and deductions. */
export type PayoutStatus =
  | 'scheduled'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'held';

export type PayoutFilter = 'all' | PayoutStatus;

export interface PayoutSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
  isCount?: boolean;
}

export interface PayoutTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
  detail?: LocalizedText;
}

/** Bank transfer proof attached after a payout completes (or pending upload). */
export type PayoutProofStatus = 'ready' | 'pending' | 'missing';

export interface PayoutTransferProof {
  status: PayoutProofStatus;
  /** Bank / MealMate transfer reference shown on the receipt. */
  reference: string;
  fileName: string;
  fileTypeLabel: LocalizedText;
  fileSizeLabel: LocalizedText;
  uploadedAtLabel: LocalizedText;
  confirmedAtLabel?: LocalizedText;
  amountKd: number;
  accountMasked: string;
  bankLabel: LocalizedText;
  note?: LocalizedText;
}

/** Source allocation feeding a payout (invoice / due). No customer PII. */
export interface PayoutAllocation {
  id: string;
  code: string;
  kind: 'invoice' | 'due';
  label: LocalizedText;
  detail: LocalizedText;
  boxes: number;
  amountKd: number;
  linkedRoute?: string;
}

export interface PayoutLine {
  id: string;
  code: string;
  status: PayoutStatus;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  scheduledAtLabel: LocalizedText;
  completedAtLabel?: LocalizedText;
  updatedAtLabel: LocalizedText;
  /** Net amount transferred (or to be transferred). */
  amountKd: number;
  boxesCovered: number;
  methodLabel: LocalizedText;
  /** Masked destination, e.g. IBAN •••• 4821 */
  accountMasked: string;
  bankLabel: LocalizedText;
  transferRef?: string;
  /** Transfer proof / bank receipt for this payout. */
  proof?: PayoutTransferProof;
  linkedInvoiceCode?: string;
  linkedInvoiceId?: string;
  linkedDueCode?: string;
  linkedDueId?: string;
  note?: LocalizedText;
  impactNote?: LocalizedText;
  nextAction?: LocalizedText;
  allocations: PayoutAllocation[];
  timeline: PayoutTimelineEvent[];
}

export interface RestaurantPayoutsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: PayoutSummary[];
  lines: PayoutLine[];
}
