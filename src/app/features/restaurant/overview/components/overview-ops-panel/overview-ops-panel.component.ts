import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideGauge,
  lucideQrCode,
  lucideTimer,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import {
  OverviewQuickAction,
  OverviewUrgentOrder,
} from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-ops-panel',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './overview-ops-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-card mm-ov-ops block' },
  viewProviders: [
    provideIcons({
      lucideClock,
      lucideGauge,
      lucideQrCode,
      lucideTimer,
      lucideWallet,
    }),
  ],
})
export class OverviewOpsPanelComponent {
  readonly orders = input.required<OverviewUrgentOrder[]>();
  readonly quickActions = input.required<OverviewQuickAction[]>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'تشغيل اليوم · تأكيد 72 ساعة' : 'Today’s ops · 72h confirmation',
  );
  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'الطلبات التي تحتاج تأكيدًا قبل إغلاق نافذة العميل'
      : 'Orders that need confirmation before the customer window closes',
  );
  readonly viewAll = computed(() =>
    this.locale.isRtl() ? 'عرض الكل' : 'View all',
  );
  readonly mealsLabel = computed(() =>
    this.locale.isRtl() ? 'وجبة' : 'meals',
  );
  readonly hoursLeft = computed(() =>
    this.locale.isRtl() ? 'ساعة متبقية' : 'hours left',
  );
  readonly actionsTitle = computed(() =>
    this.locale.isRtl() ? 'إجراءات سريعة' : 'Quick actions',
  );

  orderDate(order: OverviewUrgentOrder): string {
    return pickLocale(order.deliveryDateLabel, this.locale.locale());
  }

  program(order: OverviewUrgentOrder): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  actionLabel(action: OverviewQuickAction): string {
    return pickLocale(action.label, this.locale.locale());
  }
}
