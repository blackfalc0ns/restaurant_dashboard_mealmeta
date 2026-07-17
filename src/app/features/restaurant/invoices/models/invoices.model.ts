import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Monthly restaurant settlement invoices.
 * Based on delivered boxes, agreed box price, restaurant commission, and deductions.
 * Customer subscription commission is never shown. */
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'void';

export type InvoiceFilter = 'all' | InvoiceStatus;

export interface InvoiceSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
}

export interface InvoiceTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
  detail?: LocalizedText;
}

/** One printable / settlement line on the monthly invoice. No customer PII. */
export interface InvoiceLineItem {
  id: string;
  code: string;
  label: LocalizedText;
  detail: LocalizedText;
  boxes: number;
  amountKd: number;
  tone: 'gross' | 'commission' | 'deduction' | 'net' | 'fee';
}

export interface InvoiceLine {
  id: string;
  code: string;
  status: InvoiceStatus;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  issuedAtLabel: LocalizedText;
  dueAtLabel: LocalizedText;
  updatedAtLabel: LocalizedText;
  boxesDelivered: number;
  /** Gross box payables for the month. */
  grossKd: number;
  /** Restaurant commission deducted from box price. */
  commissionKd: number;
  commissionRatePct: number;
  /** Complaint / quality deductions. */
  deductionsKd: number;
  /** Optional subscription / platform fees if any. */
  feesKd: number;
  /** Net amount payable to restaurant. */
  netKd: number;
  linkedDueCode?: string;
  linkedDueId?: string;
  transferRef?: string;
  note?: LocalizedText;
  impactNote?: LocalizedText;
  nextAction?: LocalizedText;
  lineItems: InvoiceLineItem[];
  timeline: InvoiceTimelineEvent[];
}

export interface RestaurantInvoicesData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: InvoiceSummary[];
  lines: InvoiceLine[];
}
