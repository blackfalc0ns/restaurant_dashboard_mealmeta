import {
  KUWAIT_REGIONS,
  SERVICE_AREA_OPTIONS,
} from '../../onboarding/data/onboarding.defaults';
import { RestaurantSettingsData } from '../models/settings.model';

export const SETTINGS_MOCK: RestaurantSettingsData = {
  title: { ar: 'إعدادات المطعم', en: 'Restaurant settings' },
  subtitle: {
    ar: 'عدّل كل بيانات التسجيل: الحساب، الشركة، الموقع، المستندات، المناطق والحساب البنكي.',
    en: 'Edit all onboarding data: account, business, location, documents, regions, and bank account.',
  },
  dateLabel: { ar: 'يوليو 2026', en: 'July 2026' },
  note: {
    ar: 'تعديل السجل التجاري أو الآيبان قد يتطلب مراجعة الإدارة قبل التفعيل.',
    en: 'Commercial registration or IBAN changes may need admin review before activation.',
  },
  policyNote: {
    ar: 'هذه الصفحة تكمل بيانات الـ onboarding بعد الاعتماد. عمولة اشتراك العميل لا تُعدَّل من هنا.',
    en: 'This page maintains onboarding data after approval. Customer subscription commission is not editable here.',
  },
  summaries: [
    {
      id: 'status',
      label: { ar: 'حالة الحساب', en: 'Account status' },
      value: { ar: 'نشط', en: 'Active' },
      hint: { ar: 'معتمد', en: 'Approved' },
    },
    {
      id: 'docs',
      label: { ar: 'المستندات', en: 'Documents' },
      value: { ar: '5 / 6 مرفوعة', en: '5 / 6 uploaded' },
      hint: { ar: 'واحد ناقص', en: 'One missing' },
    },
    {
      id: 'areas',
      label: { ar: 'مناطق الخدمة', en: 'Service areas' },
      value: { ar: '4 مناطق', en: '4 areas' },
      hint: { ar: 'العاصمة وحولي', en: 'Capital & Hawally' },
    },
    {
      id: 'bank',
      label: { ar: 'الحساب البنكي', en: 'Bank account' },
      value: { ar: 'NBK · 4821', en: 'NBK · 4821' },
      hint: { ar: 'جاهز للتحويل', en: 'Ready for payout' },
    },
  ],
  countries: [{ id: 'kw', label: { ar: 'الكويت', en: 'Kuwait' } }],
  regions: KUWAIT_REGIONS.map((item) => ({
    id: item.id,
    label: { ar: item.ar, en: item.en },
  })),
  serviceAreaOptions: SERVICE_AREA_OPTIONS.map((item) => ({
    id: item.id,
    label: { ar: item.ar, en: item.en },
  })),
  payoutDayOptions: [
    { id: 'sunday', label: { ar: 'الأحد', en: 'Sunday' } },
    { id: 'monday', label: { ar: 'الإثنين', en: 'Monday' } },
    { id: 'tuesday', label: { ar: 'الثلاثاء', en: 'Tuesday' } },
    { id: 'wednesday', label: { ar: 'الأربعاء', en: 'Wednesday' } },
  ],
  draft: {
    account: {
      email: 'owner@mealmate-kitchen.kw',
      phone: '+965 5000 2140',
    },
    business: {
      restaurantName: 'مطعم ميل ميت الصحي',
      legalCompanyName: 'شركة ميل ميت للمأكولات الصحية ذ.م.م',
      commercialRegistrationNumber: 'CR-284195',
      ownerName: 'أحمد الراشد',
      ownerNationalId: '289123456789',
      cuisine: 'وجبات صحية',
      supportPhone: '+965 2221 8800',
    },
    location: {
      countryId: 'kw',
      regionId: 'capital',
      address: 'الشرق، شارع أحمد الجابر، مجمع الأفنيوز — محل 12',
      contactPersonName: 'سارة العتيبي',
      contactPhone: '+965 5000 2140',
      contactEmail: 'ops@mealmate-kitchen.kw',
    },
    documents: [
      {
        id: 'commercial-register',
        type: 'CommercialRegister',
        label: { ar: 'السجل التجاري', en: 'Commercial register' },
        required: true,
        uploaded: true,
        status: 'valid',
        fileName: 'CR-284195.pdf',
        expiresAtLabel: { ar: 'ينتهي 12 مارس 2027', en: 'Expires 12 Mar 2027' },
        detail: { ar: 'نسخة سارية ومعتمدة', en: 'Valid approved copy' },
      },
      {
        id: 'articles',
        type: 'ArticlesOfAssociation',
        label: { ar: 'عقد التأسيس', en: 'Articles of association' },
        required: true,
        uploaded: true,
        status: 'valid',
        fileName: 'articles.pdf',
        detail: { ar: 'عقد الشركة', en: 'Company articles' },
      },
      {
        id: 'company-license',
        type: 'CompanyLicense',
        label: { ar: 'ترخيص الشركة', en: 'Company license' },
        required: true,
        uploaded: true,
        status: 'expiring',
        fileName: 'company-license.pdf',
        expiresAtLabel: { ar: 'ينتهي 28 أغسطس 2026', en: 'Expires 28 Aug 2026' },
        detail: { ar: 'رخصة تشغيل', en: 'Operating license' },
      },
      {
        id: 'owner-info',
        type: 'OwnerInfoDocument',
        label: { ar: 'مستند بيانات المالك', en: 'Owner information document' },
        required: true,
        uploaded: true,
        status: 'valid',
        fileName: 'owner-info.pdf',
      },
      {
        id: 'owner-identity',
        type: 'OwnerIdentity',
        label: { ar: 'هوية المالك', en: 'Owner identity' },
        required: false,
        uploaded: true,
        status: 'valid',
        fileName: 'owner-id.pdf',
      },
      {
        id: 'food-license',
        type: 'FoodLicense',
        label: { ar: 'الترخيص الصحي / الغذائي', en: 'Food / health license' },
        required: false,
        uploaded: false,
        status: 'missing',
        detail: { ar: 'مطلوب لإكمال الملف', en: 'Required to complete the file' },
      },
    ],
    regions: {
      serviceRegions: ['salmiya', 'jabriya', 'kaifan', 'dasma'],
      bankName: 'بنك الكويت الوطني',
      iban: 'KW81CBKU00000000000012345601',
      accountHolder: 'شركة ميل ميت للمأكولات الصحية ذ.م.م',
      payoutDay: 'sunday',
      commissionRatePct: 18,
    },
    operationsToggles: [
      {
        id: 'auto-busy',
        label: { ar: 'Busy تلقائي عند امتلاء السعة', en: 'Auto Busy at capacity' },
        detail: {
          ar: 'يوقف الاستقبال الجديد عند الوصول للحد اليومي.',
          en: 'Stops new intake when the daily box limit is reached.',
        },
        enabled: true,
      },
      {
        id: 'handover-scan',
        label: { ar: 'إلزام مسح الباركود عند التسليم', en: 'Require barcode at handover' },
        detail: {
          ar: 'يمنع إغلاق التسليم بدون مسح.',
          en: 'Blocks handover close without a scan.',
        },
        enabled: true,
      },
      {
        id: 'friday-off',
        label: { ar: 'الجمعة غير يوم خدمة', en: 'Friday is non-service' },
        detail: {
          ar: 'لا يُحسب ضمن الأيام النشطة (26 يوم).',
          en: 'Not counted in the 26 active days.',
        },
        enabled: true,
      },
      {
        id: 'quiet-hours',
        label: { ar: 'ساعات هدوء للتنبيهات', en: 'Quiet hours for alerts' },
        detail: {
          ar: 'كتم التنبيهات غير الحرجة من 12 ص إلى 6 ص.',
          en: 'Mute non-critical alerts from 12 AM to 6 AM.',
        },
        enabled: false,
      },
    ],
    notificationToggles: [
      {
        id: 'ord-new',
        label: { ar: 'طلبات جديدة للتأكيد', en: 'New orders to confirm' },
        detail: {
          ar: 'عند دخول الطلب نافذة التأكيد 24 ساعة.',
          en: 'When an order enters the 24h confirmation window.',
        },
        enabled: true,
      },
      {
        id: 'ord-72',
        label: { ar: 'اقتراب قفل −72 ساعة', en: 'Approaching −72h lock' },
        detail: {
          ar: 'تنبيه قبل إغلاق تعديل العميل.',
          en: 'Alert before customer editing locks.',
        },
        enabled: true,
      },
      {
        id: 'ord-24',
        label: { ar: 'إشعار التحضير −24 ساعة', en: '−24h prep notice' },
        detail: {
          ar: 'فواتير / ملصقات / باركود جاهزة.',
          en: 'Invoices / labels / barcodes ready.',
        },
        enabled: true,
      },
      {
        id: 'fin-due',
        label: { ar: 'مستحقات وعمولة جاهزة', en: 'Dues & commission ready' },
        detail: {
          ar: 'عند إصدار مستحق الفترة.',
          en: 'When a period due is issued.',
        },
        enabled: true,
      },
      {
        id: 'fin-pay',
        label: { ar: 'تحويل مكتمل', en: 'Payout completed' },
        detail: {
          ar: 'عند تأكيد التحويل البنكي.',
          en: 'When bank transfer is confirmed.',
        },
        enabled: true,
      },
      {
        id: 'fin-ded',
        label: { ar: 'خصم جودة جديد', en: 'New quality deduction' },
        detail: {
          ar: 'عند تسجيل خصم على بوكس.',
          en: 'When a box deduction is recorded.',
        },
        enabled: true,
      },
      {
        id: 'qty-rate',
        label: { ar: 'تقييم منخفض', en: 'Low rating' },
        detail: {
          ar: 'عند تقييم أقل من 3 نجوم.',
          en: 'When a rating is below 3 stars.',
        },
        enabled: false,
      },
      {
        id: 'email-digest',
        label: { ar: 'ملخص يومي بالبريد', en: 'Daily email digest' },
        detail: {
          ar: 'ملخص العمليات والمالية كل صباح.',
          en: 'Ops and finance summary each morning.',
        },
        enabled: false,
      },
    ],
    security: {
      passwordHint: '••••••••',
      twoFactorEnabled: false,
      roleLabel: { ar: 'مالك المطعم', en: 'Restaurant owner' },
      sessions: [
        {
          id: 's1',
          device: { ar: 'هذا الجهاز · Chrome', en: 'This device · Chrome' },
          detail: { ar: 'نشط الآن · الكويت', en: 'Active now · Kuwait' },
          current: true,
        },
        {
          id: 's2',
          device: { ar: 'iPad · Safari', en: 'iPad · Safari' },
          detail: { ar: 'آخر ظهور أمس 21:10', en: 'Last seen yesterday 21:10' },
        },
        {
          id: 's3',
          device: { ar: 'Android · App', en: 'Android · App' },
          detail: { ar: 'آخر ظهور قبل 5 أيام', en: 'Last seen 5 days ago' },
        },
      ],
    },
  },
  operationsPolicyNote: {
    ar: 'قفل −72 ساعة ونافذة تأكيد 24 ساعة ثابتان من سياسة MealMate ولا يُتجاوزان من هنا.',
    en: 'The −72h lock and 24h confirmation window are fixed by MealMate policy and cannot be overridden here.',
  },
  settlementPolicyNote: {
    ar: 'عمولة المطعم تُخصم من سعر البوكس المتفق عليه. ليست عمولة اشتراك العميل.',
    en: 'Restaurant commission is deducted from the agreed box price. It is not customer subscription commission.',
  },
  documentsPolicyNote: {
    ar: 'المستندات الناقصة أو المنتهية قد توقف التسوية حتى التحديث والمراجعة.',
    en: 'Missing or expired documents may pause settlement until updated and reviewed.',
  },
  notificationsPolicyNote: {
    ar: 'التنبيهات لا تتضمن رقم هاتف العميل الحقيقي إلا في استثناءات الخصوصية.',
    en: 'Alerts never include the customer’s real phone except under privacy exceptions.',
  },
  securityPolicyNote: {
    ar: 'تغيير كلمة المرور يسجّل خروج كل الجلسات. التحقق بخطوتين موصى به للمالك.',
    en: 'Changing password signs out all sessions. Two-factor auth is recommended for the owner.',
  },
};
