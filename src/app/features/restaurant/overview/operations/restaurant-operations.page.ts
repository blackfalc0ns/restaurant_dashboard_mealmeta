import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowRight,
  lucideCalendarDays,
  lucideClipboardList,
  lucideClock,
  lucideGauge,
  lucidePackage,
  lucideScanBarcode,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_COLORS } from '@/core/brand/brand-colors';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { RestaurantWorkspaceHeaderComponent } from '@/shared/components/restaurant-workspace/restaurant-workspace-ui.component';
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

import { pickLocale } from '../overview-i18n';
import { RestaurantOperationsFacade } from './data/restaurant-operations.facade';
import {
  OpsMetric,
  OpsProgressItem,
  OpsQueueItem,
  OpsTimelineItem,
} from './models/restaurant-operations.model';
import { OperationsSkeletonComponent } from './operations-skeleton.component';

@Component({
  selector: 'mm-restaurant-operations-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    MmApexChartComponent,
    OperationsSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
  ],
  templateUrl: './restaurant-operations.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-op-page block' },
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideArrowRight,
      lucideCalendarDays,
      lucideClipboardList,
      lucideClock,
      lucideGauge,
      lucidePackage,
      lucideScanBarcode,
    }),
  ],
})
export class RestaurantOperationsPageComponent implements OnInit {
  readonly facade = inject(RestaurantOperationsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly chart = mmBaseChart('area', 220);
  readonly grid = mmBaseGrid();
  readonly stroke = mmBaseStroke('smooth');
  readonly tooltip = mmBaseTooltip();
  readonly legend = mmBaseLegend();
  readonly yaxis = mmBaseYAxis();
  readonly colors = [BRAND_COLORS.accent, BRAND_COLORS.primary];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly dateLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.dateLabel, this.locale.locale()) : '';
  });

  readonly queueTitle = computed(() =>
    this.locale.isRtl() ? 'طابور العمل العاجل' : 'Urgent work queue',
  );

  readonly queueSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'مهام تحتاج إجراءً الآن أو خلال الساعات القادمة'
      : 'Tasks that need action now or within the next hours',
  );

  readonly flowTitle = computed(() =>
    this.locale.isRtl() ? 'تدفق الطلبات اليوم' : 'Today’s order flow',
  );

  readonly progressTitle = computed(() =>
    this.locale.isRtl() ? 'تقدم التشغيل' : 'Operations progress',
  );

  readonly healthTitle = computed(() =>
    this.locale.isRtl() ? 'صحة الوردية' : 'Shift health',
  );

  readonly briefTitle = computed(() =>
    this.locale.isRtl() ? 'ملخص سريع' : 'Quick brief',
  );

  readonly timelineTitle = computed(() =>
    this.locale.isRtl() ? 'آخر الأحداث' : 'Latest events',
  );

  readonly busyOn = computed(() =>
    this.locale.isRtl() ? 'Busy مفعّل' : 'Busy on',
  );

  readonly busyOff = computed(() =>
    this.locale.isRtl() ? 'متاح للاستقبال' : 'Accepting orders',
  );

  readonly openLabel = computed(() =>
    this.locale.isRtl() ? 'فتح' : 'Open',
  );

  readonly xaxis = computed(() => {
    const data = this.facade.data();
    if (!data) return mmBaseXAxis([]);
    return mmBaseXAxis(
      data.hourly.map((point) => pickLocale(point.label, this.locale.locale())),
    );
  });

  readonly series = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    return [
      {
        name: this.locale.isRtl() ? 'وارد' : 'Inbound',
        data: data.hourly.map((point) => point.inbound),
      },
      {
        name: this.locale.isRtl() ? 'مؤكد' : 'Confirmed',
        data: data.hourly.map((point) => point.confirmed),
      },
    ];
  });

  readonly fill = {
    type: 'gradient' as const,
    gradient: {
      shadeIntensity: 0.45,
      opacityFrom: 0.35,
      opacityTo: 0.04,
      stops: [0, 100],
    },
  };

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  metricLabel(metric: OpsMetric): string {
    return pickLocale(metric.label, this.locale.locale());
  }

  metricHint(metric: OpsMetric): string {
    return pickLocale(metric.hint, this.locale.locale());
  }

  queueTitleText(item: OpsQueueItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  queueDetail(item: OpsQueueItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  queueBadge(item: OpsQueueItem): string {
    return pickLocale(item.badge, this.locale.locale());
  }

  progressLabel(item: OpsProgressItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  progressValue(item: OpsProgressItem): string {
    return pickLocale(item.valueLabel, this.locale.locale());
  }

  timelineTitleText(item: OpsTimelineItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  timelineTime(item: OpsTimelineItem): string {
    return pickLocale(item.time, this.locale.locale());
  }

  briefLabel(label: { ar: string; en: string }): string {
    return pickLocale(label, this.locale.locale());
  }

  briefNote(note: { ar: string; en: string }): string {
    return pickLocale(note, this.locale.locale());
  }

  healthLabel(): string {
    const data = this.facade.data();
    return data ? pickLocale(data.healthLabel, this.locale.locale()) : '';
  }
}
