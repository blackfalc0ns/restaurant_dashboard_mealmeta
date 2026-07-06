import type { RestaurantAuthLocale } from '../models/auth-locale.model';

export interface RestaurantLoginCopy {
  formTitle: string;
  formSubtitle: string;
  identifierLabel: string;
  passwordLabel: string;
  identifierPlaceholder: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  rememberSession: string;
  submit: string;
  submitting: string;
  showPassword: string;
  hidePassword: string;
  createAccount: string;
}

export const RESTAURANT_LOGIN_I18N: Record<RestaurantAuthLocale, RestaurantLoginCopy> = {
  ar: {
    formTitle: 'تسجيل دخول المطعم',
    formSubtitle: 'قم بإدخال بيانات الاعتماد للوصول إلى لوحة مطعمك',
    identifierLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    identifierPlaceholder: 'البريد الإلكتروني',
    passwordPlaceholder: 'أدخل كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberSession: 'تذكّرني على هذا الجهاز',
    submit: 'تسجيل الدخول',
    submitting: 'جاري التحقق...',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    createAccount: 'إنشاء حساب جديد',
  },
  en: {
    formTitle: 'Restaurant Sign In',
    formSubtitle: 'Enter your credentials to access your restaurant dashboard',
    identifierLabel: 'Email',
    passwordLabel: 'Password',
    identifierPlaceholder: 'Email',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot password?',
    rememberSession: 'Remember me on this device',
    submit: 'Sign In',
    submitting: 'Verifying...',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    createAccount: 'Create a new account',
  },
};
