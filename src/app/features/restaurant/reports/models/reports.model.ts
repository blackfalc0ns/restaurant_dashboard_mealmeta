import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant financial reports for a settlement period.
 * Aggregates delivered boxes, restaurant commission, deductions, and payouts.
 * Customer subscription commission is never shown. */
export type ReportStatus = 'ready' | 'generating' | 'scheduled' | 'failed';

export type ReportFilter = 'all' | ReportStatus;

export type ReportKind =
  | 'settlement'
  | 'boxes'
  | 'commission'
  | 'deductions'
  | 'payouts'
  | 'quality';

export interface ReportSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
  isCount?: boolean;
}

export interface ReportTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
  detail?: LocalizedText;
}

export interface ReportMetric {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
  isCount?: boolean;
  tone?: 'ok' | 'warn' | 'danger' | 'neutral';
}

/** Point for trend / comparison charts inside a report. */
export interface ReportTrendPoint {
  id: string;
  label: LocalizedText;
  boxes?: number;
  grossKd: number;
  netKd: number;
}

export interface ReportBreakdownItem {
  id: string;
  code: string;
  label: LocalizedText;
  detail: LocalizedText;
  boxes?: number;
  amountKd: number;
  tone: 'gross' | 'commission' | 'deduction' | 'net' | 'fee' | 'neutral';
  sharePct?: number;
  linkedRoute?: string;
}

export type ReportExportStatus = 'ready' | 'pending' | 'missing';

export interface ReportExportFile {
  status: ReportExportStatus;
  fileName: string;
  fileTypeLabel: LocalizedText;
  fileSizeLabel: LocalizedText;
  generatedAtLabel: LocalizedText;
  formatLabel: LocalizedText;
  note?: LocalizedText;
}

export interface ReportLine {
  id: string;
  code: string;
  status: ReportStatus;
  kind: ReportKind;
  title: LocalizedText;
  detail: LocalizedText;
  periodLabel: LocalizedText;
  generatedAtLabel: LocalizedText;
  updatedAtLabel: LocalizedText;
  boxesDelivered: number;
  /** Gross box payables covered by the report. */
  grossKd: number;
  /** Restaurant commission deducted from box price. */
  commissionKd: number;
  commissionRatePct?: number;
  /** Average agreed box price for the period. */
  avgBoxKd?: number;
  /** Complaint / quality / remake deductions. */
  deductionsKd: number;
  /** Optional platform / settlement fees. */
  feesKd?: number;
  /** Net amount after commission and deductions. */
  netKd: number;
  payoutsKd: number;
  /** Active service days in the period (typically 26). */
  activeDays?: number;
  linkedInvoiceCode?: string;
  linkedInvoiceId?: string;
  linkedStatementCode?: string;
  linkedStatementId?: string;
  linkedPayoutCode?: string;
  linkedPayoutId?: string;
  note?: LocalizedText;
  impactNote?: LocalizedText;
  nextAction?: LocalizedText;
  metrics: ReportMetric[];
  breakdown: ReportBreakdownItem[];
  /** Optional weekly / category trend for charts. */
  trendPoints?: ReportTrendPoint[];
  exportFile?: ReportExportFile;
  timeline: ReportTimelineEvent[];
}

export interface RestaurantReportsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: ReportSummary[];
  lines: ReportLine[];
}
