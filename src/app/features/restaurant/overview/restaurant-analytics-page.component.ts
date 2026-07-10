import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownToLine,
  lucideArrowLeft,
  lucideArrowRight,
  lucideBanknote,
  lucideChartNoAxesCombined,
  lucideChefHat,
  lucideClock3,
  lucideStar,
  lucideTrendingUp,
  lucideUtensils,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

@Component({
  selector: 'mm-restaurant-analytics-page',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './restaurant-analytics-page.component.html',
  styleUrl: './overview-secondary-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowDownToLine,
      lucideArrowLeft,
      lucideArrowRight,
      lucideBanknote,
      lucideChartNoAxesCombined,
      lucideChefHat,
      lucideClock3,
      lucideStar,
      lucideTrendingUp,
      lucideUtensils,
    }),
  ],
})
export class RestaurantAnalyticsPageComponent {
  readonly locale = inject(AppLocaleService);

  readonly metrics = [
    { labelAr: 'إجمالي الطلبات', labelEn: 'Total orders', value: '1,284', change: '+14.2%', icon: 'lucideUtensils' },
    { labelAr: 'معدل الالتزام', labelEn: 'On-time rate', value: '96.8%', change: '+2.4%', icon: 'lucideClock3' },
    { labelAr: 'متوسط التقييم', labelEn: 'Average rating', value: '4.8', change: '+0.2', icon: 'lucideStar' },
    { labelAr: 'صافي الإيراد', labelEn: 'Net revenue', value: '86,420', change: '+11.6%', icon: 'lucideBanknote' },
  ];

  readonly weeklyOrders = [
    { dayAr: 'السبت', dayEn: 'Sat', orders: 72, completed: 68 },
    { dayAr: 'الأحد', dayEn: 'Sun', orders: 84, completed: 80 },
    { dayAr: 'الاثنين', dayEn: 'Mon', orders: 91, completed: 86 },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', orders: 76, completed: 73 },
    { dayAr: 'الأربعاء', dayEn: 'Wed', orders: 98, completed: 94 },
    { dayAr: 'الخميس', dayEn: 'Thu', orders: 108, completed: 101 },
    { dayAr: 'الجمعة', dayEn: 'Fri', orders: 63, completed: 61 },
  ];

  readonly mealPerformance = [
    { nameAr: 'دجاج مشوي مع الأرز', nameEn: 'Grilled chicken with rice', orders: 326, rating: '4.9', percent: 92 },
    { nameAr: 'سلمون مع البطاطا', nameEn: 'Salmon with potatoes', orders: 248, rating: '4.8', percent: 75 },
    { nameAr: 'باستا بالدجاج', nameEn: 'Chicken pasta', orders: 214, rating: '4.7', percent: 66 },
    { nameAr: 'سلطة سيزر', nameEn: 'Caesar salad', orders: 178, rating: '4.6', percent: 54 },
  ];

  readonly finance = [
    { labelAr: 'قيمة الوجبات', labelEn: 'Meal value', value: '104,760 ر.س', percent: 100 },
    { labelAr: 'عمولة المنصة', labelEn: 'Platform commission', value: '12,571 ر.س', percent: 48 },
    { labelAr: 'الخصومات', labelEn: 'Deductions', value: '1,284 ر.س', percent: 18 },
    { labelAr: 'صافي المستحق', labelEn: 'Net payable', value: '90,905 ر.س', percent: 87 },
  ];

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  directionIcon(): string {
    return this.locale.isRtl() ? 'lucideArrowLeft' : 'lucideArrowRight';
  }
}
