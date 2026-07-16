import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant-created dispatch officer accounts (trips are created in the mobile app). */
export type DispatchOfficerStatus = 'active' | 'disabled' | 'invited';

export type DispatchOfficerFilter = 'all' | DispatchOfficerStatus;

export interface DispatchOfficerSummary {
  id: string;
  label: LocalizedText;
  value: number;
}

export interface DispatchOfficerTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
}

export interface DispatchOfficer {
  id: string;
  name: LocalizedText;
  phone: string;
  email: string;
  status: DispatchOfficerStatus;
  tripsCreatedToday: number;
  tripsCreatedWeek: number;
  updatedAtLabel: LocalizedText;
  joinedAtLabel: LocalizedText;
  note?: LocalizedText;
  timeline: DispatchOfficerTimelineEvent[];
}

export interface DispatchOfficersData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  summaries: DispatchOfficerSummary[];
  officers: DispatchOfficer[];
}

export interface DispatchOfficerCreateDraft {
  nameAr: string;
  nameEn: string;
  phone: string;
  email: string;
}
