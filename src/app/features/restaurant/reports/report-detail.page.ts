import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideChartColumn,
  lucideDownload,
  lucideFileText,
  lucideHandCoins,
  lucideHistory,
  lucideInfo,
  lucidePackage,
  lucideChartPie,
  lucideSearch,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_COLORS } from '@/core/brand/brand-colors';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';
import { MmApexChartComponent } from '@/shared/components/apex-chart/mm-apex-chart.component';
import {
  MM_CHART_COLORS,
  mmBaseChart,
  mmBaseGrid,
  mmBaseLegend,
  mmBaseStroke,
  mmBaseTooltip,
  mmBaseXAxis,
  mmBaseYAxis,
} from '@/shared/components/apex-chart/apex-chart.theme';

import { pickLocale } from '../overview/overview-i18n';
import { ReportsFacade } from './data/reports.facade';
import { ReportsSkeletonComponent } from './reports-skeleton.component';
import {
  ReportBreakdownItem,
  ReportExportFile,
  ReportExportStatus,
  ReportKind,
  ReportLine,
  ReportMetric,
  ReportStatus,
  ReportTimelineEvent,
} from './models/reports.model';

const BREAKDOWN_PAGE_SIZE = 8;

export type ReportDetailWindow =
  | 'details'
  | 'metrics'
  | 'breakdown'
  | 'export'
  | 'summary';

interface ReportDetailWindowCard {
  id: ReportDetailWindow;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-report-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    ReportsSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
    MmApexChartComponent,
  ],
  templateUrl: './report-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideChartColumn,
      lucideDownload,
      lucideFileText,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucidePackage,
      lucideChartPie,
      lucideSearch,
    }),
  ],
})
export class ReportDetailPageComponent implements OnInit {
  readonly facade = inject(ReportsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly breakdownPage = signal(1);
  readonly breakdownPageSize = BREAKDOWN_PAGE_SIZE;
  readonly activeWindow = signal<ReportDetailWindow | null>(null);
  readonly breakdownSearch = signal('');
  readonly exportDownloaded = signal(false);

  private readonly reportId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('reportId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('reportId') ?? '' },
  );

  private readonly routeWindow = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('window');
        return value === 'details' ||
          value === 'metrics' ||
          value === 'breakdown' ||
          value === 'export' ||
          value === 'summary'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('window');
        return value === 'details' ||
          value === 'metrics' ||
          value === 'breakdown' ||
          value === 'export' ||
          value === 'summary'
          ? value
          : null;
      })(),
    },
  );

  readonly line = computed(() => {
    const id = this.reportId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.reportId() &&
      !this.line(),
  );

  readonly breakdown = computed(() => this.line()?.breakdown ?? []);

  readonly filteredBreakdown = computed(() => {
    const query = this.breakdownSearch().trim().toLowerCase();
    const items = this.breakdown();
    if (!query) return items;
    return items.filter((item) => {
      const haystack = [
        item.code,
        item.label.ar,
        item.label.en,
        item.detail.ar,
        item.detail.en,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly breakdownTotalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredBreakdown().length / this.breakdownPageSize),
    ),
  );

  readonly pagedBreakdown = computed(() => {
    const page = Math.min(this.breakdownPage(), this.breakdownTotalPages());
    const start = (page - 1) * this.breakdownPageSize;
    return this.filteredBreakdown().slice(
      start,
      start + this.breakdownPageSize,
    );
  });

  readonly breakdownPageNumbers = computed(() =>
    Array.from(
      { length: this.breakdownTotalPages() },
      (_, index) => index + 1,
    ),
  );

  readonly breakdownRangeText = computed(() => {
    const total = this.filteredBreakdown().length;
    if (total === 0) {
      return this.locale.isRtl() ? 'لا بنود' : 'No items';
    }
    const page = Math.min(this.breakdownPage(), this.breakdownTotalPages());
    const from = (page - 1) * this.breakdownPageSize + 1;
    const to = Math.min(page * this.breakdownPageSize, total);
    return this.locale.isRtl()
      ? `عرض ${from}–${to} من ${total}`
      : `Showing ${from}–${to} of ${total}`;
  });

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly windows = computed<ReportDetailWindowCard[]>(() => [
    {
      id: 'details',
      icon: 'lucideFileText',
      titleAr: 'بيانات التقرير',
      titleEn: 'Report details',
      detailAr: 'الفترة والصيغة والرسوم البيانية',
      detailEn: 'Period, formula, and charts',
    },
    {
      id: 'metrics',
      icon: 'lucideChartColumn',
      titleAr: 'المؤشرات',
      titleEn: 'Metrics',
      detailAr: 'KPIs ورسوم الاتجاه',
      detailEn: 'KPIs and trend charts',
    },
    {
      id: 'breakdown',
      icon: 'lucideChartPie',
      titleAr: 'التفصيل',
      titleEn: 'Breakdown',
      detailAr: 'بنود الإجمالي والخصم',
      detailEn: 'Gross and deduction lines',
    },
    {
      id: 'export',
      icon: 'lucideDownload',
      titleAr: 'التصدير',
      titleEn: 'Export',
      detailAr: 'ملف PDF للتحميل',
      detailEn: 'PDF file download',
    },
    {
      id: 'summary',
      icon: 'lucideHandCoins',
      titleAr: 'الملخص والأحداث',
      titleEn: 'Summary & events',
      detailAr: 'الأثر والتايملاين',
      detailEn: 'Impact and timeline',
    },
  ]);

  readonly windowTitle = computed(() => {
    const id = this.activeWindow();
    const card = this.windows().find((item) => item.id === id);
    return card ? this.windowCardTitle(card) : '';
  });

  readonly windowSubtitle = computed(() => {
    const id = this.activeWindow();
    const card = this.windows().find((item) => item.id === id);
    return card ? this.windowCardDetail(card) : '';
  });

  readonly policyNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.policyNote, this.locale.locale()) : '';
  });

  readonly breakdownSearchPlaceholder = computed(() =>
    this.locale.isRtl() ? 'ابحث في البنود...' : 'Search breakdown...',
  );

  readonly emptyBreakdownLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد بنود مطابقة.' : 'No matching items.',
  );

  readonly compositionChart = mmBaseChart('donut', 220);
  readonly trendChart = mmBaseChart('area', 240);
  readonly metricsBarChart = mmBaseChart('bar', 240);
  readonly chartGrid = mmBaseGrid();
  readonly chartStroke = mmBaseStroke('smooth');
  readonly chartTooltip = mmBaseTooltip();
  readonly chartLegend = mmBaseLegend();
  readonly chartYaxis = mmBaseYAxis();
  readonly compositionColors = [
    BRAND_COLORS.primary,
    MM_CHART_COLORS.amber,
    MM_CHART_COLORS.red,
    MM_CHART_COLORS.slate,
  ];
  readonly trendColors = [BRAND_COLORS.primary, BRAND_COLORS.secondary];
  readonly barColors = [BRAND_COLORS.primary];

  readonly compositionFill = {
    type: 'solid' as const,
  };

  readonly trendFill = {
    type: 'gradient' as const,
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 0.32,
      opacityTo: 0.04,
      stops: [0, 100],
    },
  };

  readonly compositionPlotOptions = computed(() => ({
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '11px',
            fontFamily: 'PingAR, Cairo, sans-serif',
            color: MM_CHART_COLORS.slate,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'PingAR, Cairo, sans-serif',
            fontWeight: 800,
            color: MM_CHART_COLORS.navy,
            formatter: (val: string) => `${Number(val).toFixed(1)}`,
          },
          total: {
            show: true,
            label: this.locale.isRtl() ? 'صافي' : 'Net',
            fontSize: '11px',
            fontFamily: 'PingAR, Cairo, sans-serif',
            color: MM_CHART_COLORS.slate,
            formatter: () => {
              const line = this.line();
              return line ? line.netKd.toFixed(1) : '0';
            },
          },
        },
      },
    },
  }));

  readonly compositionLabels = computed(() => {
    const rtl = this.locale.isRtl();
    return [
      rtl ? 'صافي' : 'Net',
      rtl ? 'عمولة' : 'Commission',
      rtl ? 'خصومات' : 'Deductions',
      rtl ? 'رسوم' : 'Fees',
    ];
  });

  readonly compositionSeries = computed(() => {
    const line = this.line();
    if (!line) return [0, 0, 0, 0];
    return [
      Math.max(0, line.netKd),
      Math.max(0, line.commissionKd),
      Math.max(0, line.deductionsKd),
      Math.max(0, line.feesKd ?? 0),
    ];
  });

  readonly hasComposition = computed(() =>
    this.compositionSeries().some((value) => value > 0),
  );

  readonly trendXaxis = computed(() => {
    const line = this.line();
    const points = line?.trendPoints ?? [];
    return mmBaseXAxis(
      points.map((point) => pickLocale(point.label, this.locale.locale())),
    );
  });

  readonly trendSeries = computed(() => {
    const line = this.line();
    const points = line?.trendPoints ?? [];
    if (!points.length) return [];
    return [
      {
        name: this.locale.isRtl() ? 'إجمالي' : 'Gross',
        data: points.map((point) => point.grossKd),
      },
      {
        name: this.locale.isRtl() ? 'صافي' : 'Net',
        data: points.map((point) => point.netKd),
      },
    ];
  });

  readonly hasTrend = computed(() => this.trendSeries().length > 0);

  readonly boxesBarSeries = computed(() => {
    const line = this.line();
    const points = line?.trendPoints ?? [];
    if (!points.length) return [];
    return [
      {
        name: this.locale.isRtl() ? 'بوكسات' : 'Boxes',
        data: points.map((point) => point.boxes ?? 0),
      },
    ];
  });

  readonly hasBoxesTrend = computed(() =>
    this.boxesBarSeries().some((series) =>
      series.data.some((value) => value > 0),
    ),
  );

  readonly moneyMetricsBarSeries = computed(() => {
    const line = this.line();
    if (!line) return [];
    const money = line.metrics.filter((metric) => !metric.isCount);
    if (!money.length) return [];
    return [
      {
        name: this.locale.isRtl() ? 'KD' : 'KD',
        data: money.map((metric) => metric.valueKd),
      },
    ];
  });

  readonly moneyMetricsXaxis = computed(() => {
    const line = this.line();
    if (!line) return mmBaseXAxis([]);
    return mmBaseXAxis(
      line.metrics
        .filter((metric) => !metric.isCount)
        .map((metric) => pickLocale(metric.label, this.locale.locale())),
    );
  });

  readonly hasMoneyMetricsChart = computed(
    () => this.moneyMetricsBarSeries().length > 0,
  );

  readonly avgBoxKd = computed(() => {
    const line = this.line();
    if (!line) return 0;
    if (line.avgBoxKd != null) return line.avgBoxKd;
    if (!line.boxesDelivered) return 0;
    return line.grossKd / line.boxesDelivered;
  });

  readonly commissionRatePct = computed(() => {
    const line = this.line();
    if (!line) return 0;
    if (line.commissionRatePct != null) return line.commissionRatePct;
    if (!line.grossKd) return 0;
    return (line.commissionKd / line.grossKd) * 100;
  });

  readonly feesKd = computed(() => this.line()?.feesKd ?? 0);

  readonly pendingPayoutKd = computed(() => {
    const line = this.line();
    if (!line) return 0;
    return Math.max(0, line.netKd - line.payoutsKd);
  });

  constructor() {
    effect(() => {
      const available = this.windows().map((item) => item.id);
      if (available.length === 0) return;
      const windowId = this.routeWindow();
      const next =
        windowId && available.includes(windowId) ? windowId : available[0];
      this.activeWindow.set(next);
    });

    effect(() => {
      this.breakdownSearch();
      this.breakdownPage.set(1);
    });

    effect(() => {
      this.reportId();
      this.exportDownloaded.set(false);
    });
  }

  ngOnInit(): void {
    this.facade.ensureLoaded();
    if (!this.route.snapshot.queryParamMap.get('window')) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { window: 'details' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  windowCardTitle(card: ReportDetailWindowCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  windowCardDetail(card: ReportDetailWindowCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  windowCount(id: ReportDetailWindow): number {
    const line = this.line();
    if (!line) return 0;
    switch (id) {
      case 'details':
        return 1;
      case 'metrics':
        return line.metrics.length;
      case 'breakdown':
        return line.breakdown.length;
      case 'export':
        return line.exportFile?.status === 'ready' ? 1 : 0;
      case 'summary':
        return line.timeline.length;
      default:
        return 0;
    }
  }

  openWindow(id: ReportDetailWindow): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { window: id },
      queryParamsHandling: 'merge',
    });
  }


  onBreakdownSearch(value: string): void {
    this.breakdownSearch.set(value);
  }

  title(line: ReportLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: ReportLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: ReportLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  generatedAt(line: ReportLine): string {
    return pickLocale(line.generatedAtLabel, this.locale.locale());
  }

  updatedAt(line: ReportLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  lineNote(line: ReportLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  impactNote(line: ReportLine): string {
    return line.impactNote
      ? pickLocale(line.impactNote, this.locale.locale())
      : '';
  }

  nextAction(line: ReportLine): string {
    return line.nextAction
      ? pickLocale(line.nextAction, this.locale.locale())
      : '';
  }

  statusLabel(status: ReportStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'ready':
        return rtl ? 'جاهز' : 'Ready';
      case 'generating':
        return rtl ? 'جاري' : 'Generating';
      case 'scheduled':
        return rtl ? 'مجدول' : 'Scheduled';
      case 'failed':
        return rtl ? 'فشل' : 'Failed';
    }
  }

  kindLabel(kind: ReportKind): string {
    const rtl = this.locale.isRtl();
    switch (kind) {
      case 'settlement':
        return rtl ? 'تسوية' : 'Settlement';
      case 'boxes':
        return rtl ? 'بوكسات' : 'Boxes';
      case 'commission':
        return rtl ? 'عمولة' : 'Commission';
      case 'deductions':
        return rtl ? 'خصومات' : 'Deductions';
      case 'payouts':
        return rtl ? 'تحويلات' : 'Payouts';
      case 'quality':
        return rtl ? 'جودة' : 'Quality';
    }
  }

  metricLabel(metric: ReportMetric): string {
    return pickLocale(metric.label, this.locale.locale());
  }

  metricHint(metric: ReportMetric): string {
    return metric.hint ? pickLocale(metric.hint, this.locale.locale()) : '';
  }

  itemLabel(item: ReportBreakdownItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  itemDetail(item: ReportBreakdownItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  amountSign(amount: number): string {
    if (amount > 0) return '+';
    if (amount < 0) return '−';
    return '';
  }

  amountAbs(amount: number): number {
    return Math.abs(amount);
  }

  exportStatusLabel(status: ReportExportStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'ready':
        return rtl ? 'جاهز' : 'Ready';
      case 'pending':
        return rtl ? 'قيد التوليد' : 'Pending';
      case 'missing':
        return rtl ? 'غير متاح' : 'Missing';
    }
  }

  exportFileType(file: ReportExportFile): string {
    return pickLocale(file.fileTypeLabel, this.locale.locale());
  }

  exportFileSize(file: ReportExportFile): string {
    return pickLocale(file.fileSizeLabel, this.locale.locale());
  }

  exportGeneratedAt(file: ReportExportFile): string {
    return pickLocale(file.generatedAtLabel, this.locale.locale());
  }

  exportFormat(file: ReportExportFile): string {
    return pickLocale(file.formatLabel, this.locale.locale());
  }

  exportNote(file: ReportExportFile): string {
    return file.note ? pickLocale(file.note, this.locale.locale()) : '';
  }

  downloadExport(line: ReportLine): void {
    if (line.exportFile?.status !== 'ready') return;
    this.exportDownloaded.set(true);
  }

  eventTitle(event: ReportTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: ReportTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  eventDetail(event: ReportTimelineEvent): string {
    return event.detail ? pickLocale(event.detail, this.locale.locale()) : '';
  }

  goToBreakdownPage(page: number): void {
    this.breakdownPage.set(
      Math.min(Math.max(1, page), this.breakdownTotalPages()),
    );
  }

  nextBreakdownPage(): void {
    this.goToBreakdownPage(this.breakdownPage() + 1);
  }

  prevBreakdownPage(): void {
    this.goToBreakdownPage(this.breakdownPage() - 1);
  }

  invoiceRoute(line: ReportLine): string | null {
    return line.linkedInvoiceId
      ? `/restaurant/finance/invoices/${line.linkedInvoiceId}`
      : null;
  }

  statementRoute(line: ReportLine): string | null {
    return line.linkedStatementId
      ? `/restaurant/finance/statements/${line.linkedStatementId}`
      : null;
  }

  payoutRoute(line: ReportLine): string | null {
    return line.linkedPayoutId
      ? `/restaurant/finance/payouts/${line.linkedPayoutId}`
      : null;
  }
}
