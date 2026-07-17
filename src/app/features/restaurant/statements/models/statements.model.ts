import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Monthly restaurant account statement.
 * Tracks box payables, restaurant commission, deductions, fees, and payouts.
 * Customer subscription commission is never shown. */
export type StatementStatus = 'draft' | 'issued' | 'finalized';

export type StatementFilter = 'all' | StatementStatus;

export type StatementEntryKind =
  | 'opening'
  | 'box_credit'
  | 'commission'
  | 'deduction'
  | 'fee'
  | 'payout'
  | 'adjustment'
  | 'closing';

export interface StatementSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
  isCount?: boolean;
}

export interface StatementTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
  detail?: LocalizedText;
}

export interface StatementEntry {
  id: string;
  code: string;
  kind: StatementEntryKind;
  label: LocalizedText;
  detail: LocalizedText;
  dateLabel: LocalizedText;
  boxes?: number;
  /** Positive = credit to restaurant, negative = debit. */
  amountKd: number;
  balanceAfterKd: number;
  linkedRoute?: string;
}

export interface StatementLine {
  id: string;
  code: string;
  status: StatementStatus;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  issuedAtLabel: LocalizedText;
  updatedAtLabel: LocalizedText;
  openingBalanceKd: number;
  closingBalanceKd: number;
  creditsKd: number;
  debitsKd: number;
  boxesDelivered: number;
  payoutsKd: number;
  note?: LocalizedText;
  impactNote?: LocalizedText;
  nextAction?: LocalizedText;
  entries: StatementEntry[];
  timeline: StatementTimelineEvent[];
}

export interface RestaurantStatementsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: StatementSummary[];
  lines: StatementLine[];
}
