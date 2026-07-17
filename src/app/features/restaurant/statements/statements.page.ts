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
  lucideClipboardList,
  lucideFileCheck,
  lucideInfo,
  lucidePackage,
  lucideScrollText,
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
import { StatementsFacade } from './data/statements.facade';
import { StatementsSkeletonComponent } from './statements-skeleton.component';
import {
  StatementFilter,
  StatementLine,
  StatementStatus,
} from './models/statements.model';

export type StatementSection = 'ledger' | 'open' | 'closed';

interface StatementSectionCard {
  id: StatementSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-statements-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    StatementsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './statements.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideFileCheck,
      lucideInfo,
      lucidePackage,
      lucideScrollText,
      lucideSearch,
      lucideX,
    }),
  ],
})
export class StatementsPageComponent implements OnInit {
  readonly facade = inject(StatementsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<StatementSection | null>(null);

  private readonly routeSection = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('section');
        return value === 'ledger' || value === 'open' || value === 'closed'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('section');
        return value === 'ledger' || value === 'open' || value === 'closed'
          ? value
          : null;
      })(),
    },
  );

  readonly sections: StatementSectionCard[] = [
    {
      id: 'ledger',
      icon: 'lucideClipboardList',
      titleAr: 'سجل الكشوف',
      titleEn: 'Statement ledger',
      detailAr: 'كل كشوف الحساب',
      detailEn: 'All account statements',
    },
    {
      id: 'open',
      icon: 'lucideScrollText',
      titleAr: 'مفتوح / مسودة',
      titleEn: 'Open / draft',
      detailAr: 'مسودات وصادرة لم تُغلق',
      detailEn: 'Draft and issued not yet closed',
    },
    {
      id: 'closed',
      icon: 'lucideFileCheck',
      titleAr: 'مُغلق',
      titleEn: 'Finalized',
      detailAr: 'كشوف أُغلقت بعد التحويل',
      detailEn: 'Statements closed after payout',
    },
  ];

  readonly filters: { id: StatementFilter; labelAr: string; labelEn: string }[] =
    [
      { id: 'all', labelAr: 'الكل', labelEn: 'All' },
      { id: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
      { id: 'issued', labelAr: 'صادر', labelEn: 'Issued' },
      { id: 'finalized', labelAr: 'مُغلق', labelEn: 'Finalized' },
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
      ? 'ابحث برقم الكشف أو الفترة...'
      : 'Search by statement code or period...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد كشوف مطابقة.' : 'No matching statements.',
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

  readonly openCount = computed(
    () =>
      (this.facade.filterCounts().draft ?? 0) +
      (this.facade.filterCounts().issued ?? 0),
  );

  readonly closedCount = computed(
    () => this.facade.filterCounts().finalized ?? 0,
  );

  constructor() {
    effect(() => {
      const section = this.routeSection();
      this.activeSection.set(section);
      if (section === 'ledger') {
        this.facade.setFilter('all');
      } else if (section === 'open') {
        this.facade.setFilter('issued');
      } else if (section === 'closed') {
        this.facade.setFilter('finalized');
      }
    });
  }

  ngOnInit(): void {
    this.facade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  sectionCardTitle(card: StatementSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: StatementSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: StatementSection): number {
    switch (section) {
      case 'ledger':
        return this.facade.filterCounts().all ?? 0;
      case 'open':
        return this.openCount();
      case 'closed':
        return this.closedCount();
    }
  }

  openSection(section: StatementSection): void {
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

  openLine(line: StatementLine): void {
    void this.router.navigate(['/restaurant/finance/statements', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: StatementFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: StatementFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  lineTitle(line: StatementLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: StatementLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: StatementLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: StatementLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: StatementStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'draft':
        return rtl ? 'مسودة' : 'Draft';
      case 'issued':
        return rtl ? 'صادر' : 'Issued';
      case 'finalized':
        return rtl ? 'مُغلق' : 'Finalized';
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
