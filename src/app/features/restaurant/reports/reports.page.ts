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
  lucideChartColumn,
  lucideClipboardList,
  lucideFileCheck,
  lucideInfo,
  lucideLoaderCircle,
  lucidePackage,
  lucideSearch,
  lucideX,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { ReportsFacade } from './data/reports.facade';
import { ReportsSkeletonComponent } from './reports-skeleton.component';
import {
  ReportFilter,
  ReportKind,
  ReportLine,
  ReportStatus,
} from './models/reports.model';

export type ReportSection = 'library' | 'ready' | 'pipeline';

interface ReportSectionCard {
  id: ReportSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-reports-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    ReportsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './reports.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideChartColumn,
      lucideClipboardList,
      lucideFileCheck,
      lucideInfo,
      lucideLoaderCircle,
      lucidePackage,
      lucideSearch,
      lucideX,
    }),
  ],
})
export class ReportsPageComponent implements OnInit {
  readonly facade = inject(ReportsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<ReportSection | null>(null);

  private readonly routeSection = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('section');
        return value === 'library' || value === 'ready' || value === 'pipeline'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('section');
        return value === 'library' || value === 'ready' || value === 'pipeline'
          ? value
          : null;
      })(),
    },
  );

  readonly sections: ReportSectionCard[] = [
    {
      id: 'library',
      icon: 'lucideClipboardList',
      titleAr: 'مكتبة التقارير',
      titleEn: 'Report library',
      detailAr: 'كل التقارير المالية',
      detailEn: 'All financial reports',
    },
    {
      id: 'ready',
      icon: 'lucideFileCheck',
      titleAr: 'جاهز للتحميل',
      titleEn: 'Ready to download',
      detailAr: 'تقارير مكتملة',
      detailEn: 'Completed reports',
    },
    {
      id: 'pipeline',
      icon: 'lucideLoaderCircle',
      titleAr: 'قيد التوليد',
      titleEn: 'In pipeline',
      detailAr: 'جاري / مجدول / فشل',
      detailEn: 'Generating / scheduled / failed',
    },
  ];

  readonly filters: { id: ReportFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
    { id: 'generating', labelAr: 'جاري', labelEn: 'Generating' },
    { id: 'scheduled', labelAr: 'مجدول', labelEn: 'Scheduled' },
    { id: 'failed', labelAr: 'فشل', labelEn: 'Failed' },
  ];

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

  readonly note = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.note, this.locale.locale()) : '';
  });

  readonly policyNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.policyNote, this.locale.locale()) : '';
  });

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث برقم التقرير أو الفترة...'
      : 'Search by report code or period...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد تقارير مطابقة.' : 'No matching reports.',
  );

  readonly rangeText = computed(() => {
    const range = this.facade.rangeLabel();
    if (range.total === 0) {
      return this.locale.isRtl() ? 'لا نتائج' : 'No results';
    }
    return this.locale.isRtl()
      ? `عرض ${range.from}–${range.to} من ${range.total}`
      : `Showing ${range.from}–${range.to} of ${range.total}`;
  });

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly sectionTitle = computed(() => {
    const section = this.activeSection();
    if (!section) return '';
    const card = this.sections.find((item) => item.id === section);
    return card ? this.sectionCardTitle(card) : '';
  });

  readonly sectionSubtitle = computed(() => {
    const section = this.activeSection();
    if (!section) return '';
    const card = this.sections.find((item) => item.id === section);
    return card ? this.sectionCardDetail(card) : '';
  });

  readonly pipelineCount = computed(
    () =>
      (this.facade.filterCounts().generating ?? 0) +
      (this.facade.filterCounts().scheduled ?? 0) +
      (this.facade.filterCounts().failed ?? 0),
  );

  constructor() {
    effect(() => {
      const section = this.routeSection();
      this.activeSection.set(section);
      if (section === 'library') {
        this.facade.setFilter('all');
      } else if (section === 'ready') {
        this.facade.setFilter('ready');
      } else if (section === 'pipeline') {
        this.facade.setFilter('generating');
      }
    });
  }

  ngOnInit(): void {
    this.facade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  sectionCardTitle(card: ReportSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: ReportSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: ReportSection): number {
    switch (section) {
      case 'library':
        return this.facade.filterCounts().all ?? 0;
      case 'ready':
        return this.facade.filterCounts().ready ?? 0;
      case 'pipeline':
        return this.pipelineCount();
    }
  }

  openSection(section: ReportSection): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }

  closeSection(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: null },
      queryParamsHandling: 'merge',
    });
  }

  openLine(line: ReportLine): void {
    void this.router.navigate(['/restaurant/finance/reports', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: ReportFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: ReportFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  lineTitle(line: ReportLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: ReportLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: ReportLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: ReportLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
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

  goToPage(page: number): void {
    this.facade.goToPage(page);
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  prevPage(): void {
    this.facade.prevPage();
  }
}
