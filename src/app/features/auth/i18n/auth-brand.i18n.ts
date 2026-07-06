import type { RestaurantAuthLocale } from '../models/auth-locale.model';

export interface RestaurantAuthBrandCopy {
  langSwitch: string;
  authHeroAlt: string;
  brandTaglineLead: string;
  brandTaglineAccent: string;
  brandTitleLead: string;
  brandTitleAccent: string;
  brandDescBefore: string;
  brandDescHighlight: string;
  pillarOrders: string;
  pillarConfirm: string;
  pillarSettlements: string;
  formEyebrow: string;
  footerRights: string;
  footerSecure: string;
  footerCopyright: string;
}

export const RESTAURANT_AUTH_BRAND_I18N: Record<RestaurantAuthLocale, RestaurantAuthBrandCopy> = {
  ar: {
    langSwitch: 'English',
    authHeroAlt: 'مطبخ مطعم شريك — وجبات صحية',
    brandTaglineLead: 'أكل صحي',
    brandTaglineAccent: 'عملاء يكررون',
    brandTitleLead: 'نمِّ مطعمك',
    brandTitleAccent: 'بثقة',
    brandDescBefore: 'طلبات يومية، قوائم مرنة، تأكيدات سريعة وتسويات واضحة —',
    brandDescHighlight: 'كلها من لوحة واحدة.',
    pillarOrders: 'طلبات يومية',
    pillarConfirm: 'تأكيد خلال ٢٤ ساعة',
    pillarSettlements: 'تسويات شفافة',
    formEyebrow: 'لوحة المطعم',
    footerRights: 'جميع الحقوق محفوظة.',
    footerSecure: 'اتصال آمن',
    footerCopyright: '© 2026 MealMate',
  },
  en: {
    langSwitch: 'العربية',
    authHeroAlt: 'Partner restaurant kitchen — healthy meals',
    brandTaglineLead: 'Healthy meals',
    brandTaglineAccent: 'Loyal customers',
    brandTitleLead: 'Grow your',
    brandTitleAccent: 'restaurant',
    brandDescBefore: 'Daily orders, flexible menus, fast confirmations, and clear settlements —',
    brandDescHighlight: 'all in one dashboard.',
    pillarOrders: 'Daily orders',
    pillarConfirm: '24h confirmation',
    pillarSettlements: 'Clear payouts',
    formEyebrow: 'Restaurant Panel',
    footerRights: 'All rights reserved.',
    footerSecure: 'Secure connection',
    footerCopyright: '© 2026 MealMate',
  },
};
