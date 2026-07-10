import { AppLocale } from '@/core/i18n/app-locale.model';

import { LocalizedText } from './models/restaurant-overview.model';

export function pickLocale(text: LocalizedText, locale: AppLocale): string {
  return locale === 'ar' ? text.ar : text.en;
}
