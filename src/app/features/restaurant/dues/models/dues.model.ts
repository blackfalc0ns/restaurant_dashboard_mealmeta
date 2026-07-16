import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant-facing dues (box payables) and MealMate restaurant commission. */
export type DueStatus = 'pending' | 'scheduled' | 'paid' | 'held';

export type DueKind = 'meal_payable' | 'commission' | 'net_settlement';

export type DueFilter = 'all' | DueStatus;

export interface DueSummary {
  id: string;
  label: LocalizedText;
  valueKd: number;
  hint?: LocalizedText;
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
