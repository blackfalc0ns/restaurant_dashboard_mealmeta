import type { RestaurantAuthLocale } from '../models/auth-locale.model';

export interface RestaurantRegisterCopy {
  formTitle: string;
  formSubtitle: string;
  comingSoon: string;
  backToLogin: string;
  createAccount: string;
}

export const RESTAURANT_REGISTER_I18N: Record<RestaurantAuthLocale, RestaurantRegisterCopy> = {
  ar: {
    formTitle: 'تسجيل مطعم جديد',
    formSubtitle: 'انضم إلى منظومة MealMate وابدأ إدارة طلباتك',
    comingSoon: 'التسجيل الذاتي للمطاعم قيد التجهيز. تواصل مع فريق MealMate لطلب حساب.',
    backToLogin: 'لديك حساب؟ تسجيل الدخول',
    createAccount: 'إنشاء حساب',
  },
  en: {
    formTitle: 'Register your restaurant',
    formSubtitle: 'Join the MealMate network and start managing your orders',
    comingSoon: 'Self-service restaurant registration is coming soon. Contact MealMate to request an account.',
    backToLogin: 'Already have an account? Sign in',
    createAccount: 'Create account',
  },
};
