import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Editable restaurant settings — mirrors onboarding draft plus ops prefs.
 * Customer subscription commission is admin-only and never editable here. */
export type SettingsSectionId =
  | 'account-security'
  | 'business-location'
  | 'documents-settlement'
  | 'operations-notifications';

export type DocumentStatus = 'valid' | 'expiring' | 'expired' | 'missing';

export interface SettingsOption {
  id: string;
  label: LocalizedText;
}

export interface SettingsSummary {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  hint?: LocalizedText;
}

export interface SettingsToggle {
  id: string;
  label: LocalizedText;
  detail: LocalizedText;
  enabled: boolean;
}

export interface SettingsDocumentItem {
  id: string;
  type: string;
  label: LocalizedText;
  required: boolean;
  uploaded: boolean;
  status: DocumentStatus;
  fileName?: string;
  expiresAtLabel?: LocalizedText;
  detail?: LocalizedText;
}

export interface SettingsAccountDraft {
  email: string;
  phone: string;
}

export interface SettingsBusinessDraft {
  restaurantName: string;
  legalCompanyName: string;
  commercialRegistrationNumber: string;
  ownerName: string;
  ownerNationalId: string;
  cuisine: string;
  supportPhone: string;
}

export interface SettingsLocationDraft {
  countryId: string;
  regionId: string;
  address: string;
  contactPersonName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface SettingsRegionsDraft {
  serviceRegions: string[];
  bankName: string;
  iban: string;
  accountHolder: string;
  payoutDay: string;
  commissionRatePct: number;
}

export interface SettingsSecurityDraft {
  passwordHint: string;
  twoFactorEnabled: boolean;
  roleLabel: LocalizedText;
  sessions: Array<{
    id: string;
    device: LocalizedText;
    detail: LocalizedText;
    current?: boolean;
  }>;
}

export interface SettingsDraft {
  account: SettingsAccountDraft;
  business: SettingsBusinessDraft;
  location: SettingsLocationDraft;
  documents: SettingsDocumentItem[];
  regions: SettingsRegionsDraft;
  operationsToggles: SettingsToggle[];
  notificationToggles: SettingsToggle[];
  security: SettingsSecurityDraft;
}

export interface RestaurantSettingsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  policyNote: LocalizedText;
  summaries: SettingsSummary[];
  countries: SettingsOption[];
  regions: SettingsOption[];
  serviceAreaOptions: SettingsOption[];
  payoutDayOptions: SettingsOption[];
  draft: SettingsDraft;
  operationsPolicyNote: LocalizedText;
  settlementPolicyNote: LocalizedText;
  documentsPolicyNote: LocalizedText;
  notificationsPolicyNote: LocalizedText;
  securityPolicyNote: LocalizedText;
}
