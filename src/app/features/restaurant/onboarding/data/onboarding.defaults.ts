import type {
  OnboardingCatalogOption,
  OnboardingDocumentItem,
  OnboardingStepMeta,
  RestaurantOnboardingDraft,
} from '../models/onboarding.model';

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { id: 'account', order: 1, icon: 'user' },
  { id: 'business', order: 2, icon: 'building' },
  { id: 'offerings', order: 3, icon: 'package' },
  { id: 'location', order: 4, icon: 'map' },
  { id: 'documents', order: 5, icon: 'file' },
  { id: 'regions', order: 6, icon: 'globe' },
  { id: 'review', order: 7, icon: 'check' },
];

export const ONBOARDING_PROGRAM_OPTIONS: OnboardingCatalogOption[] = [
  { id: 'PRG-001', ar: 'رشاقة', en: 'Cutting' },
  { id: 'PRG-002', ar: 'ضخامة', en: 'Bulking' },
  { id: 'PRG-003', ar: 'محافظة', en: 'Maintain' },
  { id: 'PRG-004', ar: 'كيتو', en: 'Keto' },
];

export const ONBOARDING_BUNDLE_OPTIONS: OnboardingCatalogOption[] = [
  {
    id: 'BND-001',
    ar: 'باقة كاملة',
    en: 'Full bundle',
    detailAr: 'فطور + وجبتان رئيسيتان + سناك + سلطة',
    detailEn: 'Breakfast + 2 mains + snack + salad',
  },
  {
    id: 'BND-002',
    ar: 'باقة الغداء',
    en: 'Lunch bundle',
    detailAr: 'وجبة رئيسية + سلطة',
    detailEn: '1 main + salad',
  },
  {
    id: 'BND-003',
    ar: 'باقة مخصصة',
    en: 'Custom bundle',
    detailAr: 'تركيبة حسب اختيار العميل',
    detailEn: 'Customer-configured composition',
  },
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

export function createEmptyDraft(): RestaurantOnboardingDraft {
  return {
    account: { email: '', phone: '', password: '', confirmPassword: '' },
    business: {
      restaurantName: '',
      legalCompanyName: '',
      commercialRegistrationNumber: '',
      ownerName: '',
      ownerNationalId: '',
    },
    offerings: { programIds: [], bundleIds: [] },
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
