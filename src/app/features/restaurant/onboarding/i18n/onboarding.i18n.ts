import type { RestaurantAuthLocale } from '@/features/auth/models/auth-locale.model';
import type { OnboardingStepId } from '../models/onboarding.model';

export interface OnboardingStepCopy {
  title: string;
  subtitle: string;
  tip: string;
}

export interface OnboardingCopy {
  eyebrow: string;
  pageTitle: string;
  pageSubtitle: string;
  progressLabel: string;
  saveDraft: string;
  back: string;
  next: string;
  submit: string;
  submitting: string;
  loginLink: string;
  submittedTitle: string;
  submittedDesc: string;
  goToLogin: string;
  steps: Record<OnboardingStepId, OnboardingStepCopy>;
  fields: {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    restaurantName: string;
    legalCompanyName: string;
    crNumber: string;
    ownerName: string;
    ownerNationalId: string;
    country: string;
    region: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    bankName: string;
    iban: string;
    accountHolder: string;
    serviceRegions: string;
    programs: string;
    bundles: string;
    offeringsHintPrograms: string;
    offeringsHintBundles: string;
    offeringsComboEmpty: string;
    offeringsPricingNote: string;
    uploadHint: string;
    uploadAction: string;
    uploaded: string;
    optional: string;
    reviewSectionAccount: string;
    reviewSectionBusiness: string;
    reviewSectionOfferings: string;
    reviewSectionLocation: string;
    reviewSectionDocuments: string;
    reviewSectionRegions: string;
  };
}

export const ONBOARDING_I18N: Record<RestaurantAuthLocale, OnboardingCopy> = {
  ar: {
    eyebrow: 'انضم لشبكة MealMate',
    pageTitle: 'تسجيل مطعم جديد',
    pageSubtitle: 'أكمل الخطوات التالية لإرسال طلبك للمراجعة والاعتماد',
    progressLabel: 'التقدم',
    saveDraft: 'حفظ كمسودة',
    back: 'السابق',
    next: 'التالي',
    submit: 'إرسال الطلب للمراجعة',
    submitting: 'جاري الإرسال...',
    loginLink: 'لديك حساب؟ تسجيل الدخول',
    submittedTitle: 'تم إرسال طلبك بنجاح',
    submittedDesc:
      'فريق MealMate سيراجع بياناتك ووثائقك خلال ٢–٣ أيام عمل. ستصلك إشعارات بحالة الطلب على بريدك.',
    goToLogin: 'الذهاب لتسجيل الدخول',
    steps: {
      account: {
        title: 'بيانات الدخول',
        subtitle: 'أنشئ حساب لوحة المطعم',
        tip: 'استخدم بريداً رسمياً للمطعم — سيُستخدم لاستلام إشعارات الطلبات والتسويات.',
      },
      business: {
        title: 'بيانات الشركة',
        subtitle: 'الاسم التجاري والسجل والمالك',
        tip: 'يجب أن تطابق البيانات السجل التجاري والوثائق الرسمية المرفقة.',
      },
      offerings: {
        title: 'البرامج والباقات',
        subtitle: 'اختر ما ستقدّمه عبر MealMate',
        tip: 'الاختيار هنا يحدد تركيبات البوكس التي ستسعّرها لاحقاً من صفحة التسعير بعد الاعتماد.',
      },
      location: {
        title: 'الموقع والتواصل',
        subtitle: 'العنوان ومسؤول التواصل',
        tip: 'مسؤول التواصل هو الشخص الذي يتابع الطلبات اليومية مع فريق MealMate.',
      },
      documents: {
        title: 'الوثائق الرسمية',
        subtitle: 'ارفع المستندات المطلوبة',
        tip: 'تأكد من وضوح الصور وصلاحية تواريخ الانتهاء قبل الرفع.',
      },
      regions: {
        title: 'المناطق والحساب البنكي',
        subtitle: 'نطاق الخدمة وبيانات التسوية',
        tip: 'يمكنك تعديل المناطق لاحقاً — ابدأ بالمناطق التي تغطيها فعلياً.',
      },
      review: {
        title: 'المراجعة والإرسال',
        subtitle: 'تأكد من صحة البيانات',
        tip: 'راجع كل البيانات قبل الإرسال — التعديل بعد الإرسال يتطلب طلب تعديل من الأدمن.',
      },
    },
    fields: {
      email: 'البريد الإلكتروني',
      phone: 'رقم الجوال',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      restaurantName: 'الاسم التجاري للمطعم',
      legalCompanyName: 'اسم الشركة القانوني',
      crNumber: 'رقم السجل التجاري',
      ownerName: 'اسم المالك / المفوض',
      ownerNationalId: 'الرقم المدني للمالك',
      country: 'الدولة',
      region: 'المحافظة',
      address: 'العنوان',
      contactPerson: 'مسؤول التواصل',
      contactPhone: 'هاتف مسؤول التواصل',
      contactEmail: 'بريد مسؤول التواصل',
      bankName: 'اسم البنك',
      iban: 'رقم الآيبان',
      accountHolder: 'اسم صاحب الحساب',
      serviceRegions: 'مناطق الخدمة',
      programs: 'البرامج',
      bundles: 'الباقات',
      offeringsHintPrograms: 'اختر برنامجاً واحداً على الأقل',
      offeringsHintBundles: 'اختر باقة واحدة على الأقل',
      offeringsComboEmpty: 'اختر برنامجاً وباقة لمعرفة عدد البوكسات',
      offeringsPricingNote: 'التسعير يتم لاحقاً من صفحة التسعير بعد اعتماد الحساب — لا أسعار هنا.',
      uploadHint: 'PDF أو JPG — حتى ٥ ميجابايت',
      uploadAction: 'رفع الملف',
      uploaded: 'تم الرفع',
      optional: 'اختياري',
      reviewSectionAccount: 'بيانات الدخول',
      reviewSectionBusiness: 'بيانات الشركة',
      reviewSectionOfferings: 'البرامج والباقات',
      reviewSectionLocation: 'الموقع والتواصل',
      reviewSectionDocuments: 'الوثائق',
      reviewSectionRegions: 'المناطق والبنك',
    },
  },
  en: {
    eyebrow: 'Join the MealMate network',
    pageTitle: 'Register your restaurant',
    pageSubtitle: 'Complete the steps below to submit your application for review',
    progressLabel: 'Progress',
    saveDraft: 'Save draft',
    back: 'Back',
    next: 'Next',
    submit: 'Submit for review',
    submitting: 'Submitting...',
    loginLink: 'Already have an account? Sign in',
    submittedTitle: 'Application submitted successfully',
    submittedDesc:
      'The MealMate team will review your data and documents within 2–3 business days. You will receive status updates by email.',
    goToLogin: 'Go to sign in',
    steps: {
      account: {
        title: 'Account credentials',
        subtitle: 'Create your restaurant panel login',
        tip: 'Use an official restaurant email — it will receive order and settlement notifications.',
      },
      business: {
        title: 'Company details',
        subtitle: 'Trade name, CR number, and owner',
        tip: 'Data must match your commercial register and attached official documents.',
      },
      offerings: {
        title: 'Programs & bundles',
        subtitle: 'Choose what you will offer on MealMate',
        tip: 'Your selection defines the box combinations you will price later from the pricing page after approval.',
      },
      location: {
        title: 'Location & contact',
        subtitle: 'Address and contact person',
        tip: 'The contact person is who follows daily orders with the MealMate team.',
      },
      documents: {
        title: 'Official documents',
        subtitle: 'Upload required files',
        tip: 'Ensure images are clear and expiry dates are valid before uploading.',
      },
      regions: {
        title: 'Regions & bank account',
        subtitle: 'Service coverage and payout details',
        tip: 'You can adjust regions later — start with areas you actually cover.',
      },
      review: {
        title: 'Review & submit',
        subtitle: 'Confirm your information',
        tip: 'Review everything before submitting — changes after submission require an admin change request.',
      },
    },
    fields: {
      email: 'Email',
      phone: 'Mobile number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      restaurantName: 'Restaurant trade name',
      legalCompanyName: 'Legal company name',
      crNumber: 'Commercial registration number',
      ownerName: 'Owner / authorized person',
      ownerNationalId: 'Owner civil ID',
      country: 'Country',
      region: 'Governorate',
      address: 'Address',
      contactPerson: 'Contact person',
      contactPhone: 'Contact phone',
      contactEmail: 'Contact email',
      bankName: 'Bank name',
      iban: 'IBAN',
      accountHolder: 'Account holder name',
      serviceRegions: 'Service regions',
      programs: 'Programs',
      bundles: 'Bundles',
      offeringsHintPrograms: 'Select at least one program',
      offeringsHintBundles: 'Select at least one bundle',
      offeringsComboEmpty: 'Select a program and a bundle to see box count',
      offeringsPricingNote: 'Pricing happens later on the pricing page after account approval — no prices here.',
      uploadHint: 'PDF or JPG — up to 5 MB',
      uploadAction: 'Upload file',
      uploaded: 'Uploaded',
      optional: 'Optional',
      reviewSectionAccount: 'Account',
      reviewSectionBusiness: 'Company',
      reviewSectionOfferings: 'Programs & bundles',
      reviewSectionLocation: 'Location & contact',
      reviewSectionDocuments: 'Documents',
      reviewSectionRegions: 'Regions & bank',
    },
  },
};
