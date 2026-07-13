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
  lucideBadgeDollarSign,
  lucideChartColumn,
  lucideFileText,
  lucideHandCoins,
  lucideLandmark,
  lucideReceipt,
  lucideScrollText,
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
import { RestaurantFinanceOverviewFacade } from './data/restaurant-finance-overview.facade';
import { FinanceOverviewSkeletonComponent } from './finance-overview-skeleton.component';
import {
  FinanceBreakdownItem,
  FinanceMetric,
  FinancePeriod,
  FinanceQuickLink,
  FinanceTxnItem,
} from './models/restaurant-finance-overview.model';

@Component({
  selector: 'mm-restaurant-finance-overview-page',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    NgIcon,
    PageStateComponent,
    MmApexChartComponent,
    FinanceOverviewSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
  ],
  templateUrl: './restaurant-finance-overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-fn-page block' },
  viewProviders: [
    provideIcons({
      lucideBadgeDollarSign,
      lucideChartColumn,
      lucideFileText,
      lucideHandCoins,
      lucideLandmark,
      lucideReceipt,
      lucideScrollText,
    }),
  ],
})
export class RestaurantFinanceOverviewPageComponent implements OnInit {
  readonly facade = inject(RestaurantFinanceOverviewFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly periods: Array<{ id: FinancePeriod; labelAr: string; labelEn: string }> = [
    { id: 'month', labelAr: 'هذا الشهر', labelEn: 'This month' },
    { id: 'quarter', labelAr: 'هذا الربع', labelEn: 'This quarter' },
    { id: 'year', labelAr: 'هذه السنة', labelEn: 'This year' },
  ];

  readonly chart = mmBaseChart('area', 260);
  readonly grid = mmBaseGrid();
  readonly stroke = mmBaseStroke('smooth');
  readonly tooltip = mmBaseTooltip();
  readonly legend = mmBaseLegend();
  readonly yaxis = mmBaseYAxis();
  readonly colors = [BRAND_COLORS.primary, BRAND_COLORS.secondary];

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
    this.locale.isRtl() ? 'المستحق مقابل السداد' : 'Payables vs payouts',
  );

  readonly trendSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'اتجاه الأشهر الستة الأخيرة'
      : 'Trend over the last six months',
  );

  readonly breakdownTitle = computed(() =>
    this.locale.isRtl() ? 'تفصيل المستحق' : 'Payable breakdown',
  );

  readonly txnTitle = computed(() =>
    this.locale.isRtl() ? 'آخر الحركات' : 'Recent activity',
  );

  readonly linksTitle = computed(() =>
    this.locale.isRtl() ? 'اختصارات المالية' : 'Finance shortcuts',
  );

  readonly kd = computed(() => (this.locale.isRtl() ? 'د.ك' : 'KD'));

  readonly statementNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.statementNote, this.locale.locale()) : '';
  });

  readonly xaxis = computed(() => {
    const data = this.facade.data();
    if (!data) return mmBaseXAxis([]);
    return mmBaseXAxis(
      data.monthly.map((point) => pickLocale(point.label, this.locale.locale())),
    );
  });

  readonly series = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    return [
      {
        name: this.locale.isRtl() ? 'مستحق' : 'Payable',
        data: data.monthly.map((point) => point.payable),
      },
      {
        name: this.locale.isRtl() ? 'سداد' : 'Payout',
        data: data.monthly.map((point) => point.payout),
      },
    ];
  });

  readonly fill = {
    type: 'gradient' as const,
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 0.32,
      opacityTo: 0.04,
      stops: [0, 100],
    },
  };

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  onPeriodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as FinancePeriod;
    this.facade.setPeriod(value);
  }

  periodOptionLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  metricLabel(metric: FinanceMetric): string {
    return pickLocale(metric.label, this.locale.locale());
  }

  metricHint(metric: FinanceMetric): string {
    return pickLocale(metric.hint, this.locale.locale());
  }

  breakdownLabel(item: FinanceBreakdownItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  txnTitleText(item: FinanceTxnItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  txnDetail(item: FinanceTxnItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  txnStatus(item: FinanceTxnItem): string {
    return pickLocale(item.status, this.locale.locale());
  }

  linkLabel(link: FinanceQuickLink): string {
    return pickLocale(link.label, this.locale.locale());
  }
}
