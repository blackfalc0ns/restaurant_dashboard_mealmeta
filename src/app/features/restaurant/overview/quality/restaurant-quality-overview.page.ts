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
  lucideBadgeCheck,
  lucideClock,
  lucideMessageSquareWarning,
  lucideReply,
  lucideStar,
  lucideTimer,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_COLORS } from '@/core/brand/brand-colors';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
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
import { RestaurantQualityOverviewFacade } from './data/restaurant-quality-overview.facade';
import {
  QualityCategoryScore,
  QualityComplaintItem,
  QualityMetric,
  QualityRatingItem,
} from './models/restaurant-quality-overview.model';
import { QualityOverviewSkeletonComponent } from './quality-overview-skeleton.component';

@Component({
  selector: 'mm-restaurant-quality-overview-page',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    NgIcon,
    PageStateComponent,
    MmApexChartComponent,
    QualityOverviewSkeletonComponent,
  ],
  templateUrl: './restaurant-quality-overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ql-page block' },
  viewProviders: [
    provideIcons({
      lucideBadgeCheck,
      lucideClock,
      lucideMessageSquareWarning,
      lucideReply,
      lucideStar,
      lucideTimer,
    }),
  ],
})
export class RestaurantQualityOverviewPageComponent implements OnInit {
  readonly facade = inject(RestaurantQualityOverviewFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly chart = mmBaseChart('line', 240);
  readonly distChart = mmBaseChart('bar', 180);
  readonly grid = mmBaseGrid();
  readonly stroke = { ...mmBaseStroke('smooth'), width: 3 };
  readonly tooltip = mmBaseTooltip();
  readonly legend = mmBaseLegend();
  readonly yaxis = mmBaseYAxis();
  readonly colors = [BRAND_COLORS.primary, BRAND_COLORS.accent];
  readonly distColors = [BRAND_COLORS.primary];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly scoreTitle = computed(() =>
    this.locale.isRtl() ? 'مؤشر الجودة' : 'Quality score',
  );

  readonly trendTitle = computed(() =>
    this.locale.isRtl() ? 'اتجاه التقييم والشكاوى' : 'Rating & complaints trend',
  );

  readonly distTitle = computed(() =>
    this.locale.isRtl() ? 'توزيع النجوم' : 'Star distribution',
  );

  readonly categoriesTitle = computed(() =>
    this.locale.isRtl() ? 'تفصيل الفئات' : 'Category breakdown',
  );

  readonly complaintsTitle = computed(() =>
    this.locale.isRtl() ? 'شكاوى تحتاج رد' : 'Complaints needing reply',
  );

  readonly complaintsSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'رد خلال نافذة SLA قبل التصعيد'
      : 'Reply within the SLA window before escalation',
  );

  readonly ratingsTitle = computed(() =>
    this.locale.isRtl() ? 'أحدث التقييمات' : 'Latest ratings',
  );

  readonly ratingsSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'آخر ملاحظات العملاء على وجباتك'
      : 'Latest customer notes on your meals',
  );

  readonly replyLabel = computed(() =>
    this.locale.isRtl() ? 'رد الآن' : 'Reply now',
  );

  readonly ratingsCountLabel = computed(() => {
    const count = this.facade.data()?.ratingsCount ?? 0;
    return this.locale.isRtl() ? `${count} تقييم` : `${count} ratings`;
  });

  readonly stars = computed(() => {
    const rating = Math.round(this.facade.data()?.averageRating ?? 0);
    return Array.from({ length: 5 }, (_, index) => index < rating);
  });

  readonly xaxis = computed(() => {
    const data = this.facade.data();
    if (!data) return mmBaseXAxis([]);
    return mmBaseXAxis(
      data.trend.map((point) => pickLocale(point.label, this.locale.locale())),
    );
  });

  readonly series = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    return [
      {
        name: this.locale.isRtl() ? 'التقييم' : 'Rating',
        data: data.trend.map((point) => point.rating),
      },
      {
        name: this.locale.isRtl() ? 'الشكاوى' : 'Complaints',
        data: data.trend.map((point) => point.complaints),
      },
    ];
  });

  readonly distXaxis = computed(() =>
    mmBaseXAxis(
      this.locale.isRtl()
        ? ['1★', '2★', '3★', '4★', '5★']
        : ['1★', '2★', '3★', '4★', '5★'],
    ),
  );

  readonly distSeries = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    return [
      {
        name: this.locale.isRtl() ? 'عدد التقييمات' : 'Ratings',
        data: data.distribution,
      },
    ];
  });

  readonly distPlotOptions = {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
      distributed: true,
    },
  };

  readonly distBarColors = [
    '#c1c7d0',
    '#d97706',
    '#f67e15',
    '#40bd7f',
    '#04994e',
  ];

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  metricLabel(metric: QualityMetric): string {
    return pickLocale(metric.label, this.locale.locale());
  }

  metricHint(metric: QualityMetric): string {
    return pickLocale(metric.hint, this.locale.locale());
  }

  categoryLabel(item: QualityCategoryScore): string {
    return pickLocale(item.label, this.locale.locale());
  }

  complaintTitle(item: QualityComplaintItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  complaintDetail(item: QualityComplaintItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  complaintSla(item: QualityComplaintItem): string {
    return pickLocale(item.slaLabel, this.locale.locale());
  }

  ratingMeal(item: QualityRatingItem): string {
    return pickLocale(item.mealName, this.locale.locale());
  }

  ratingComment(item: QualityRatingItem): string {
    return pickLocale(item.comment, this.locale.locale());
  }

  ratingTime(item: QualityRatingItem): string {
    return pickLocale(item.timeLabel, this.locale.locale());
  }

  starFlags(count: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }
}
