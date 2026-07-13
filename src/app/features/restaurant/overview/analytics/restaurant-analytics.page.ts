import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownRight,
  lucideArrowUpRight,
  lucideBadgeCheck,
  lucideClipboardList,
  lucideGauge,
  lucideMinus,
  lucidePackageCheck,
  lucideStar,
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
import { AnalyticsSkeletonComponent } from './analytics-skeleton.component';
import { RestaurantAnalyticsFacade } from './data/restaurant-analytics.facade';
import {
  AnalyticsMetric,
  AnalyticsPeriod,
  AnalyticsTopMeal,
  AnalyticsFinanceBar,
} from './models/restaurant-analytics.model';

@Component({
  selector: 'mm-restaurant-analytics-page',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    NgIcon,
    PageStateComponent,
    MmApexChartComponent,
    AnalyticsSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
  ],
  templateUrl: './restaurant-analytics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-an-page block' },
  viewProviders: [
    provideIcons({
      lucideArrowDownRight,
      lucideArrowUpRight,
      lucideBadgeCheck,
      lucideClipboardList,
      lucideGauge,
      lucideMinus,
      lucidePackageCheck,
      lucideStar,
    }),
  ],
})
export class RestaurantAnalyticsPageComponent implements OnInit {
  readonly facade = inject(RestaurantAnalyticsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly periods: Array<{ id: AnalyticsPeriod; labelAr: string; labelEn: string }> = [
    { id: '7d', labelAr: 'آخر 7 أيام', labelEn: 'Last 7 days' },
    { id: '30d', labelAr: 'آخر 30 يوم', labelEn: 'Last 30 days' },
    { id: '90d', labelAr: 'آخر 90 يوم', labelEn: 'Last 90 days' },
  ];

  readonly chart = mmBaseChart('bar', 260);
  readonly grid = mmBaseGrid();
  readonly stroke = mmBaseStroke('smooth');
  readonly tooltip = mmBaseTooltip();
  readonly legend = mmBaseLegend();
  readonly yaxis = mmBaseYAxis();
  readonly colors = [BRAND_COLORS.primary, BRAND_COLORS.gradient2From];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly periodLabel = computed(() =>
    this.locale.isRtl() ? 'الفترة' : 'Period',
  );

  readonly trendTitle = computed(() =>
    this.locale.isRtl() ? 'الطلبات المؤكدة مقابل المسلّمة' : 'Confirmed vs delivered',
  );

  readonly trendSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'أداء التشغيل اليومي خلال الفترة المحددة'
      : 'Daily operations performance for the selected period',
  );

  readonly qualityTitle = computed(() =>
    this.locale.isRtl() ? 'مؤشر الجودة' : 'Quality score',
  );

  readonly topMealsTitle = computed(() =>
    this.locale.isRtl() ? 'أكثر الوجبات طلبًا' : 'Top ordered meals',
  );

  readonly financeTitle = computed(() =>
    this.locale.isRtl() ? 'ملخص مالي' : 'Finance summary',
  );

  readonly insightsTitle = computed(() =>
    this.locale.isRtl() ? 'رؤى سريعة' : 'Quick insights',
  );

  readonly ratingsLabel = computed(() => {
    const count = this.facade.data()?.quality.ratingsCount ?? 0;
    return this.locale.isRtl() ? `${count} تقييم` : `${count} ratings`;
  });

  readonly kd = computed(() => (this.locale.isRtl() ? 'د.ك' : 'KD'));

  readonly ordersLabel = computed(() =>
    this.locale.isRtl() ? 'طلب' : 'orders',
  );

  readonly xaxis = computed(() => {
    const data = this.facade.data();
    if (!data) return mmBaseXAxis([]);
    return mmBaseXAxis(
      data.weeklySeries.map((point) => pickLocale(point.label, this.locale.locale())),
    );
  });

  readonly series = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    return [
      {
        name: this.locale.isRtl() ? 'مؤكد' : 'Confirmed',
        data: data.weeklySeries.map((point) => point.confirmed),
      },
      {
        name: this.locale.isRtl() ? 'مسلّم' : 'Delivered',
        data: data.weeklySeries.map((point) => point.delivered),
      },
    ];
  });

  readonly plotOptions = {
    bar: {
      borderRadius: 6,
      columnWidth: '48%',
    },
  };

  readonly stars = computed(() => {
    const rating = Math.round(this.facade.data()?.quality.averageRating ?? 0);
    return Array.from({ length: 5 }, (_, index) => index < rating);
  });

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  onPeriodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as AnalyticsPeriod;
    this.facade.setPeriod(value);
  }

  periodOptionLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  metricLabel(metric: AnalyticsMetric): string {
    return pickLocale(metric.label, this.locale.locale());
  }

  metricDelta(metric: AnalyticsMetric): string {
    return pickLocale(metric.delta, this.locale.locale());
  }

  trendIcon(metric: AnalyticsMetric): string {
    if (metric.direction === 'up') return 'lucideArrowUpRight';
    if (metric.direction === 'down') return 'lucideArrowDownRight';
    return 'lucideMinus';
  }

  mealName(meal: AnalyticsTopMeal): string {
    return pickLocale(meal.name, this.locale.locale());
  }

  financeLabel(bar: AnalyticsFinanceBar): string {
    return pickLocale(bar.label, this.locale.locale());
  }

  qualityRowLabel(label: { ar: string; en: string }): string {
    return pickLocale(label, this.locale.locale());
  }

  insightTitle(title: { ar: string; en: string }): string {
    return pickLocale(title, this.locale.locale());
  }

  insightDetail(detail: { ar: string; en: string }): string {
    return pickLocale(detail, this.locale.locale());
  }
}
