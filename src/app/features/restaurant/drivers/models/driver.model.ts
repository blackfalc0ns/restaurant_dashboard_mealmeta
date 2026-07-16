import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Restaurant-managed driver lifecycle (F23). */
export type DriverStatus =
  | 'active'
  | 'disabled'
  | 'pending'
  | 'rejected'
  | 'license_alert';

export type DriverFilter = 'all' | DriverStatus;

export type DriverDocumentKind = 'license' | 'vehicle' | 'identity';

export type DriverDocumentStatus = 'verified' | 'pending' | 'rejected' | 'expiring';

export interface DriverSummary {
  id: string;
  label: LocalizedText;
  value: number;
}

export interface DriverDocument {
  id: string;
  kind: DriverDocumentKind;
  label: LocalizedText;
  status: DriverDocumentStatus;
  fileName: string;
  updatedAtLabel: LocalizedText;
}

export interface DriverTimelineEvent {
  id: string;
  title: LocalizedText;
  timeLabel: LocalizedText;
  tone: 'ok' | 'warn' | 'danger' | 'neutral';
}

export interface RestaurantDriver {
  id: string;
  name: LocalizedText;
  phone: string;
  email: string;
  status: DriverStatus;
  vehicleLabel: LocalizedText;
  vehicleType: LocalizedText;
  vehicleColor: LocalizedText;
  plateNumber: string;
  engineNumber: string;
  licenseNumber: string;
  licenseExpiryLabel: LocalizedText;
  licenseExpiringSoon: boolean;
  deliveriesToday: number;
  deliveriesWeek: number;
  updatedAtLabel: LocalizedText;
  joinedAtLabel: LocalizedText;
  note?: LocalizedText;
  documents: DriverDocument[];
  timeline: DriverTimelineEvent[];
}

export interface RestaurantDriversData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  summaries: DriverSummary[];
  drivers: RestaurantDriver[];
}
