import type { RestaurantAuthLocale } from '../models/auth-locale.model';

export interface RestaurantVerifyOtpCopy {
  formTitle: string;
  formSubtitle: string;
  codeLabel: string;
  verify: string;
  verifying: string;
  resend: string;
  resendIn: string;
  backToForgotPassword: string;
  invalidCode: string;
}

export const RESTAURANT_VERIFY_OTP_I18N: Record<RestaurantAuthLocale, RestaurantVerifyOtpCopy> = {
  ar: {
    formTitle: 'أدخل رمز التحقق',
    formSubtitle: 'أرسلنا رمزاً مكوناً من ٦ أرقام إلى',
    codeLabel: 'رمز التحقق',
    verify: 'تأكيد الرمز',
    verifying: 'جاري التحقق...',
    resend: 'إعادة إرسال الرمز',
    resendIn: 'إعادة الإرسال خلال',
    backToForgotPassword: 'تغيير البريد الإلكتروني',
    invalidCode: 'رمز التحقق غير صحيح. حاول مرة أخرى.',
  },
  en: {
    formTitle: 'Enter verification code',
    formSubtitle: 'We sent a 6-digit code to',
    codeLabel: 'Verification code',
    verify: 'Verify code',
    verifying: 'Verifying...',
    resend: 'Resend code',
    resendIn: 'Resend in',
    backToForgotPassword: 'Change email address',
    invalidCode: 'Invalid verification code. Please try again.',
  },
};
