export type OnboardingStepId =
  | 'account'
  | 'business'
  | 'location'
  | 'documents'
  | 'regions'
  | 'review';

export type OnboardingViewState = 'editing' | 'submitting' | 'submitted';

export interface OnboardingAccountData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OnboardingBusinessData {
  restaurantName: string;
  legalCompanyName: string;
  commercialRegistrationNumber: string;
  ownerName: string;
  ownerNationalId: string;
}

export interface OnboardingLocationData {
  countryId: string;
  regionId: string;
  address: string;
  contactPersonName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface OnboardingDocumentItem {
  id: string;
  type: string;
  labelAr: string;
  labelEn: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
}

export interface OnboardingRegionsData {
  serviceRegions: string[];
  bankName: string;
  iban: string;
  accountHolder: string;
}

export interface RestaurantOnboardingDraft {
  account: OnboardingAccountData;
  business: OnboardingBusinessData;
  location: OnboardingLocationData;
  documents: OnboardingDocumentItem[];
  regions: OnboardingRegionsData;
}

export interface OnboardingStepMeta {
  id: OnboardingStepId;
  order: number;
  icon: string;
}
