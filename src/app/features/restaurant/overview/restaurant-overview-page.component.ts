import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import type { ApexAxisChartSeries, ApexNonAxisChartSeries } from 'ng-apexcharts';

import { MmApexChartComponent } from '@/shared/components/apex-chart/mm-apex-chart.component';
import {
  mmBaseChart,
  mmBaseGrid,
  mmBaseLegend,
  mmBaseStroke,
  mmBaseTooltip,
  mmBaseXAxis,
  mmBaseYAxis,
} from '@/shared/components/apex-chart/apex-chart.theme';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBanknote,
  lucideCalendarClock,
  lucideCheckCheck,
  lucideChefHat,
  lucideClipboardList,
  lucideCircleAlert,
  lucideClock3,
  lucidePackageCheck,
  lucideQrCode,
  lucideReceiptText,
  lucideSettings,
  lucideStar,
  lucideTrendingUp,
  lucideTruck,
  lucideUtensils,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

interface OverviewMetric {
  labelAr: string;
  labelEn: string;
  value: string;
  noteAr: string;
  noteEn: string;
  icon: string;
  tone: 'green' | 'amber' | 'blue' | 'slate';
}

interface OverviewOrder {
  id: string;
  time: string;
  mealsAr: string;
  mealsEn: string;
  count: number;
  statusAr: string;
  statusEn: string;
  status: 'prep' | 'ready' | 'driver';
}

interface OverviewAlert {
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  route: string;
  icon: string;
  tone: 'urgent' | 'warning' | 'info';
}

@Component({
  selector: 'mm-restaurant-overview-page',
  standalone: true,
  imports: [RouterLink, NgIcon, NgClass, MmApexChartComponent],
  templateUrl: './restaurant-overview-page.component.html',
  styleUrl: './restaurant-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBanknote,
      lucideCalendarClock,
      lucideCheckCheck,
      lucideChefHat,
      lucideClipboardList,
      lucideCircleAlert,
      lucideClock3,
      lucidePackageCheck,
      lucideQrCode,
      lucideReceiptText,
      lucideSettings,
      lucideStar,
      lucideTrendingUp,
      lucideTruck,
      lucideUtensils,
    }),
  ],
})
export class RestaurantOverviewPageComponent {
  readonly locale = inject(AppLocaleService);

  readonly metrics: OverviewMetric[] = [
    {
      labelAr: 'طلبات اليوم',
      labelEn: "Today's orders",
      value: '48',
      noteAr: '+12% عن أمس',
      noteEn: '+12% from yesterday',
      icon: 'lucideReceiptText',
      tone: 'green',
    },
    {
      labelAr: 'بانتظار التأكيد',
      labelEn: 'Pending confirmation',
      value: '2',
      noteAr: 'أقرب مهلة خلال 3 ساعات',
      noteEn: 'Next deadline in 3 hours',
      icon: 'lucideClock3',
      tone: 'amber',
    },
    {
      labelAr: 'وجبة قيد التحضير',
      labelEn: 'Meals in preparation',
      value: '136',
      noteAr: '31 طلبًا نشطًا',
      noteEn: '31 active orders',
      icon: 'lucideChefHat',
      tone: 'blue',
    },
    {
      labelAr: 'صافي المستحقات',
      labelEn: 'Net dues',
      value: '8,460',
      noteAr: 'ر.س خلال يوليو',
      noteEn: 'SAR in July',
      icon: 'lucideBanknote',
      tone: 'slate',
    },
  ];

  readonly orderFlow = [
    { labelAr: 'مؤكد', labelEn: 'Confirmed', value: 48, percent: 100 },
    { labelAr: 'قيد التحضير', labelEn: 'Preparing', value: 31, percent: 65 },
    { labelAr: 'جاهز', labelEn: 'Ready', value: 12, percent: 25 },
    { labelAr: 'تم التسليم', labelEn: 'Handed over', value: 5, percent: 10 },
  ];

  readonly upcomingOrders: OverviewOrder[] = [
    {
      id: 'ORD-2481',
      time: '11:30',
      mealsAr: 'دجاج مشوي، أرز وخضار',
      mealsEn: 'Grilled chicken, rice & vegetables',
      count: 18,
      statusAr: 'قيد التحضير',
      statusEn: 'Preparing',
      status: 'prep',
    },
    {
      id: 'ORD-2482',
      time: '12:15',
      mealsAr: 'سلمون، بطاطا وسلطة',
      mealsEn: 'Salmon, potatoes & salad',
      count: 12,
      statusAr: 'جاهز للتغليف',
      statusEn: 'Ready to pack',
      status: 'ready',
    },
    {
      id: 'ORD-2483',
      time: '13:00',
      mealsAr: 'باستا بالدجاج',
      mealsEn: 'Chicken pasta',
      count: 9,
      statusAr: 'بانتظار السائق',
      statusEn: 'Waiting for driver',
      status: 'driver',
    },
  ];

  readonly capacity = [
    { labelAr: 'وجبات أساسية', labelEn: 'Main meals', used: 136, total: 180, percent: 76 },
    { labelAr: 'وجبات خفيفة', labelEn: 'Light meals', used: 42, total: 80, percent: 53 },
    { labelAr: 'إضافات', labelEn: 'Add-ons', used: 28, total: 60, percent: 47 },
  ];

  readonly alerts: OverviewAlert[] = [
    {
      titleAr: 'طلبان يحتاجان التأكيد',
      titleEn: '2 orders need confirmation',
      detailAr: 'تنتهي أقرب مهلة الساعة 09:45 م',
      detailEn: 'Next deadline is at 09:45 PM',
      route: '/restaurant/orders/pending-confirmation',
      icon: 'lucideCircleAlert',
      tone: 'urgent',
    },
    {
      titleAr: '3 طلبات بدون ملصقات',
      titleEn: '3 orders are missing labels',
      detailAr: 'جهّز الملصقات قبل موعد الاستلام',
      detailEn: 'Prepare labels before pickup time',
      route: '/restaurant/orders/labels',
      icon: 'lucideQrCode',
      tone: 'warning',
    },
    {
      titleAr: 'سائق واحد في الطريق',
      titleEn: '1 driver is on the way',
      detailAr: 'الوصول المتوقع خلال 18 دقيقة',
      detailEn: 'Expected arrival in 18 minutes',
      route: '/restaurant/delivery/drivers',
      icon: 'lucideTruck',
      tone: 'info',
    },
  ];

  readonly workspaceLinks = [
    {
      labelAr: 'الطلبات',
      labelEn: 'Orders',
      detailAr: 'اليومية والتأكيد والتسليم',
      detailEn: 'Daily, confirmation & handover',
      route: '/restaurant/orders/daily',
      icon: 'lucideClipboardList',
    },
    {
      labelAr: 'التشغيل',
      labelEn: 'Operations',
      detailAr: 'القوائم والأسعار والسعة',
      detailEn: 'Menus, pricing & capacity',
      route: '/restaurant/operations/menu',
      icon: 'lucideChefHat',
    },
    {
      labelAr: 'التوصيل',
      labelEn: 'Delivery',
      detailAr: 'السائقون وتسليم الطلبات',
      detailEn: 'Drivers & order handover',
      route: '/restaurant/delivery/drivers',
      icon: 'lucideTruck',
    },
    {
      labelAr: 'الجودة',
      labelEn: 'Quality',
      detailAr: 'التقييمات ومؤشرات الجودة',
      detailEn: 'Ratings & quality indicators',
      route: '/restaurant/quality/ratings',
      icon: 'lucideStar',
    },
    {
      labelAr: 'المالية',
      labelEn: 'Finance',
      detailAr: 'المستحقات والفواتير والتقارير',
      detailEn: 'Dues, invoices & reports',
      route: '/restaurant/finance/dues',
      icon: 'lucideBanknote',
    },
    {
      labelAr: 'الإعدادات',
      labelEn: 'Settings',
      detailAr: 'بيانات المطعم والحساب',
      detailEn: 'Restaurant profile & account',
      route: '/restaurant/settings',
      icon: 'lucideSettings',
    },
  ];

  readonly chartOptions = {
    chart: mmBaseChart('area', 240),
    series: [
      {
        name: this.locale.isRtl() ? 'الطلبات' : 'Orders',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: this.locale.isRtl() ? 'متوسط الأسبوع الماضي' : 'Last week avg',
        data: [21, 35, 25, 45, 30, 85, 90],
      }
    ] as ApexAxisChartSeries,
    xaxis: mmBaseXAxis(['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']),
    yaxis: mmBaseYAxis(),
    stroke: mmBaseStroke('smooth'),
    grid: mmBaseGrid(),
    tooltip: mmBaseTooltip(),
    legend: mmBaseLegend(),
  };

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  directionIcon(): string {
    return this.locale.isRtl() ? 'lucideArrowLeft' : 'lucideArrowRight';
  }

  getMetricIconClass(tone: string): string {
    switch (tone) {
      case 'green': return 'bg-green-50 text-green-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'slate': return 'bg-slate-50 text-slate-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }

  getFlowColor(index: number): string {
    const colors = ['bg-[#04994e]', 'bg-emerald-500', 'bg-amber-500', 'bg-slate-700'];
    return colors[index % colors.length];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'prep': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'ready': return 'bg-green-50 text-green-700 border border-green-100';
      case 'driver': return 'bg-amber-50 text-amber-700 border border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  }

  getAlertClass(tone: string): string {
    switch (tone) {
      case 'urgent': return 'bg-red-50/50 border-red-100 hover:bg-red-50';
      case 'warning': return 'bg-amber-50/50 border-amber-100 hover:bg-amber-50';
      case 'info': return 'bg-blue-50/50 border-blue-100 hover:bg-blue-50';
      default: return 'bg-gray-50 border-gray-100 hover:bg-gray-100';
    }
  }

  getAlertIconClass(tone: string): string {
    switch (tone) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'warning': return 'bg-amber-100 text-amber-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getAlertTextClass(tone: string): string {
    switch (tone) {
      case 'urgent': return 'text-red-600/80';
      case 'warning': return 'text-amber-600/80';
      case 'info': return 'text-blue-600/80';
      default: return 'text-gray-500';
    }
  }
}
