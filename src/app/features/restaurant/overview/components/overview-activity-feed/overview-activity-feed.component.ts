import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideInfo,
  lucideTriangleAlert,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import {
  OverviewActivityItem,
  OverviewAlertSeverity,
} from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-activity-feed',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './overview-activity-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-card mm-ov-activity block' },
  viewProviders: [
    provideIcons({
      lucideCircleAlert,
      lucideCircleCheck,
      lucideInfo,
      lucideTriangleAlert,
    }),
  ],
})
export class OverviewActivityFeedComponent {
  readonly items = input.required<OverviewActivityItem[]>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'مركز المتابعة' : 'Activity center',
  );
  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'تنبيهات تشغيلية ومالية تحتاج انتباهك'
      : 'Operational and finance alerts that need attention',
  );
  readonly viewAll = computed(() =>
    this.locale.isRtl() ? 'عرض الكل' : 'View all',
  );

  itemTitle(item: OverviewActivityItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  itemDetail(item: OverviewActivityItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  itemTime(item: OverviewActivityItem): string {
    return pickLocale(item.timeLabel, this.locale.locale());
  }

  iconFor(severity: OverviewAlertSeverity): string {
    switch (severity) {
      case 'critical':
        return 'lucideCircleAlert';
      case 'warning':
        return 'lucideTriangleAlert';
      case 'success':
        return 'lucideCircleCheck';
      default:
        return 'lucideInfo';
    }
  }
}
