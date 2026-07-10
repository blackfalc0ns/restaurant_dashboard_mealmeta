import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideCircleAlert,
  lucideClock3,
  lucideFileText,
  lucidePackageCheck,
  lucideQrCode,
  lucideReceipt,
  lucideTruck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

type ActivityType = 'all' | 'urgent' | 'orders' | 'finance';

interface FollowUpItem {
  id: string;
  type: Exclude<ActivityType, 'all'>;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  timeAr: string;
  timeEn: string;
  actionAr: string;
  actionEn: string;
  route: string;
  icon: string;
  tone: 'red' | 'amber' | 'blue' | 'green';
}

@Component({
  selector: 'mm-restaurant-activity-page',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './restaurant-activity-page.component.html',
  styleUrl: './overview-secondary-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideCircleAlert,
      lucideClock3,
      lucideFileText,
      lucidePackageCheck,
      lucideQrCode,
      lucideReceipt,
      lucideTruck,
    }),
  ],
})
export class RestaurantActivityPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly selectedType = signal<ActivityType>('all');

  readonly filters = [
    { id: 'all' as const, labelAr: 'الكل', labelEn: 'All' },
    { id: 'urgent' as const, labelAr: 'عاجل', labelEn: 'Urgent' },
    { id: 'orders' as const, labelAr: 'الطلبات', labelEn: 'Orders' },
    { id: 'finance' as const, labelAr: 'المالية', labelEn: 'Finance' },
  ];

  readonly items: FollowUpItem[] = [
    { id: 'A-01', type: 'urgent', titleAr: 'تأكيد طلب ORD-2491', titleEn: 'Confirm order ORD-2491', detailAr: 'تنتهي مهلة التأكيد خلال ساعتين و18 دقيقة', detailEn: 'Confirmation deadline ends in 2h 18m', timeAr: 'منذ 12 دقيقة', timeEn: '12 minutes ago', actionAr: 'مراجعة الطلب', actionEn: 'Review order', route: '/restaurant/orders/pending-confirmation', icon: 'lucideCircleAlert', tone: 'red' },
    { id: 'A-02', type: 'orders', titleAr: '3 طلبات تحتاج طباعة ملصقات', titleEn: '3 orders need labels', detailAr: 'مواعيد الاستلام تبدأ الساعة 12:15', detailEn: 'Pickup times start at 12:15', timeAr: 'منذ 25 دقيقة', timeEn: '25 minutes ago', actionAr: 'تجهيز الملصقات', actionEn: 'Prepare labels', route: '/restaurant/orders/labels', icon: 'lucideQrCode', tone: 'amber' },
    { id: 'A-03', type: 'orders', titleAr: 'السائق وصل لاستلام ORD-2482', titleEn: 'Driver arrived for ORD-2482', detailAr: 'تحقق من الباركود قبل تسجيل التسليم', detailEn: 'Verify the barcode before handover', timeAr: 'الآن', timeEn: 'Now', actionAr: 'فتح التسليم', actionEn: 'Open handover', route: '/restaurant/orders/handover', icon: 'lucideTruck', tone: 'blue' },
    { id: 'A-04', type: 'finance', titleAr: 'صدرت فاتورة يونيو', titleEn: 'June invoice was issued', detailAr: 'صافي المستحق 82,640 ر.س بعد الخصومات', detailEn: 'Net payable is SAR 82,640 after deductions', timeAr: 'اليوم، 09:30', timeEn: 'Today, 09:30', actionAr: 'عرض الفاتورة', actionEn: 'View invoice', route: '/restaurant/finance/invoices', icon: 'lucideFileText', tone: 'green' },
    { id: 'A-05', type: 'finance', titleAr: 'إيصال تحويل جديد', titleEn: 'New transfer receipt', detailAr: 'تم تسجيل دفعة بقيمة 38,200 ر.س', detailEn: 'A SAR 38,200 payout was recorded', timeAr: 'أمس، 16:10', timeEn: 'Yesterday, 16:10', actionAr: 'عرض الإيصال', actionEn: 'View receipt', route: '/restaurant/finance/payouts', icon: 'lucideReceipt', tone: 'green' },
    { id: 'A-06', type: 'orders', titleAr: 'اكتمل تجهيز 12 طلبًا', titleEn: '12 orders are ready', detailAr: 'الطلبات جاهزة للتغليف والتسليم', detailEn: 'Orders are ready for packing and handover', timeAr: 'أمس، 14:45', timeEn: 'Yesterday, 14:45', actionAr: 'عرض الطلبات', actionEn: 'View orders', route: '/restaurant/orders/daily', icon: 'lucidePackageCheck', tone: 'blue' },
  ];

  readonly filteredItems = computed(() => {
    const selected = this.selectedType();
    return selected === 'all' ? this.items : this.items.filter((item) => item.type === selected);
  });

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  directionIcon(): string {
    return this.locale.isRtl() ? 'lucideArrowLeft' : 'lucideArrowRight';
  }
}
