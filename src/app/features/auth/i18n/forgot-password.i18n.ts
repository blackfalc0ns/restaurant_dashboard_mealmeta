import type { RestaurantAuthLocale } from '../models/auth-locale.model';

export interface RestaurantForgotPasswordCopy {
  formTitle: string;
  formSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  submitting: string;
  backToLogin: string;
}

export const RESTAURANT_FORGOT_PASSWORD_I18N: Record<
  RestaurantAuthLocale,
  RestaurantForgotPasswordCopy
> = {
  ar: {
    formTitle: 'استعادة كلمة المرور',
    formSubtitle: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'البريد الإلكتروني',
    submit: 'إرسال رابط الاستعادة',
    submitting: 'جاري الإرسال...',
    backToLogin: 'العودة لتسجيل الدخول',
  },
  en: {
    formTitle: 'Reset your password',
    formSubtitle: 'Enter your email and we will send you a reset link',
    emailLabel: 'Email',
    emailPlaceholder: 'Email',
    submit: 'Send reset link',
    submitting: 'Sending...',
    backToLogin: 'Back to sign in',
  },
};
