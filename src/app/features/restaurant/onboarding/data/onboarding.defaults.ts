import type { OnboardingDocumentItem, OnboardingStepMeta } from '../models/onboarding.model';

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { id: 'account', order: 1, icon: 'user' },
  { id: 'business', order: 2, icon: 'building' },
  { id: 'location', order: 3, icon: 'map' },
  { id: 'documents', order: 4, icon: 'file' },
  { id: 'regions', order: 5, icon: 'globe' },
  { id: 'review', order: 6, icon: 'check' },
];

export const DEFAULT_DOCUMENTS: OnboardingDocumentItem[] = [
  {
    id: 'commercial-register',
    type: 'CommercialRegister',
    labelAr: 'السجل التجاري',
    labelEn: 'Commercial register',
    required: true,
    uploaded: false,
  },
  {
    id: 'articles',
    type: 'ArticlesOfAssociation',
    labelAr: 'عقد التأسيس',
    labelEn: 'Articles of association',
    required: true,
    uploaded: false,
  },
  {
    id: 'company-license',
    type: 'CompanyLicense',
    labelAr: 'ترخيص الشركة',
    labelEn: 'Company license',
    required: true,
    uploaded: false,
  },
  {
    id: 'owner-info',
    type: 'OwnerInfoDocument',
    labelAr: 'مستند بيانات المالك',
    labelEn: 'Owner information document',
    required: true,
    uploaded: false,
  },
  {
    id: 'owner-identity',
    type: 'OwnerIdentity',
    labelAr: 'هوية المالك',
    labelEn: 'Owner identity',
    required: false,
    uploaded: false,
  },
  {
    id: 'food-license',
    type: 'FoodLicense',
    labelAr: 'الترخيص الصحي / الغذائي',
    labelEn: 'Food / health license',
    required: false,
    uploaded: false,
  },
];

export const KUWAIT_REGIONS = [
  { id: 'capital', ar: 'العاصمة', en: 'Kuwait City' },
  { id: 'hawally', ar: 'حولي', en: 'Hawally' },
  { id: 'farwaniya', ar: 'الفروانية', en: 'Farwaniya' },
  { id: 'ahmadi', ar: 'الأحمدي', en: 'Ahmadi' },
  { id: 'jahra', ar: 'الجهراء', en: 'Jahra' },
  { id: 'mubarak', ar: 'مبارك الكبير', en: 'Mubarak Al-Kabeer' },
];

export const SERVICE_AREA_OPTIONS = [
  { id: 'salmiya', ar: 'السالمية', en: 'Salmiya' },
  { id: 'rumaithiya', ar: 'الرميثية', en: 'Rumaithiya' },
  { id: 'jabriya', ar: 'الجابرية', en: 'Jabriya' },
  { id: 'kaifan', ar: 'كيفان', en: 'Kaifan' },
  { id: 'fahaheel', ar: 'الفحيحيل', en: 'Fahaheel' },
  { id: 'mangaf', ar: 'المنقف', en: 'Mangaf' },
  { id: 'shuwaikh', ar: 'الشويخ', en: 'Shuwaikh' },
  { id: 'dasma', ar: 'الدسمة', en: 'Dasma' },
];

export function createEmptyDraft(): import('../models/onboarding.model').RestaurantOnboardingDraft {
  return {
    account: { email: '', phone: '', password: '', confirmPassword: '' },
    business: {
      restaurantName: '',
      legalCompanyName: '',
      commercialRegistrationNumber: '',
      ownerName: '',
      ownerNationalId: '',
    },
    location: {
      countryId: 'kw',
      regionId: '',
      address: '',
      contactPersonName: '',
      contactPhone: '',
      contactEmail: '',
    },
    documents: DEFAULT_DOCUMENTS.map((doc) => ({ ...doc })),
    regions: { serviceRegions: [], bankName: '', iban: '', accountHolder: '' },
  };
}
