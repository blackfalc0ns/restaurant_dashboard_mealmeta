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
  lucideBadgePercent,
  lucideClipboardList,
  lucideHandCoins,
  lucideInfo,
  lucidePackage,
  lucideSearch,
  lucideWallet,
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
import { DuesFacade } from './data/dues.facade';
import { DuesSkeletonComponent } from './dues-skeleton.component';
import {
  DueFilter,
  DueKind,
  DueLine,
  DueStatus,
} from './models/dues.model';

export type DueSection = 'ledger' | 'pending' | 'commission';

interface DueSectionCard {
  id: DueSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-dues-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DuesSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './dues.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideBadgePercent,
      lucideClipboardList,
      lucideHandCoins,
      lucideInfo,
      lucidePackage,
      lucideSearch,
      lucideWallet,
    }),
  ],
})
export class DuesPageComponent implements OnInit {
  readonly facade = inject(DuesFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<DueSection>('ledger');

  private readonly routeSection = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('section');
        return value === 'ledger' ||
          value === 'pending' ||
          value === 'commission'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('section');
        return value === 'ledger' ||
          value === 'pending' ||
          value === 'commission'
          ? value
          : null;
      })(),
    },
  );

  readonly sections: DueSectionCard[] = [
    {
      id: 'ledger',
      icon: 'lucideClipboardList',
      titleAr: 'سجل المستحقات',
      titleEn: 'Dues ledger',
      detailAr: 'كل بنود التسوية حسب الفترة والحالة',
      detailEn: 'All settlement lines by period and status',
    },
    {
      id: 'pending',
      icon: 'lucideWallet',
      titleAr: 'المستحق المعلّق',
      titleEn: 'Pending payout',
      detailAr: 'بنود جاهزة أو مجدولة للتحويل',
      detailEn: 'Lines ready or scheduled for transfer',
    },
    {
      id: 'commission',
      icon: 'lucideBadgePercent',
      titleAr: 'عمولة المطعم',
      titleEn: 'Restaurant commission',
      detailAr: 'نسبة الاتفاق وملخص العمولة المستقطعة',
      detailEn: 'Agreement rate and withheld commission summary',
    },
  ];

  readonly filters: { id: DueFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'pending', labelAr: 'معلّق', labelEn: 'Pending' },
    { id: 'scheduled', labelAr: 'مجدول', labelEn: 'Scheduled' },
    { id: 'paid', labelAr: 'مدفوع', labelEn: 'Paid' },
    { id: 'held', labelAr: 'موقوف', labelEn: 'Held' },
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

  readonly commissionNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.commissionNote, this.locale.locale()) : '';
  });

  readonly agreementRate = computed(
    () => this.facade.data()?.agreementRatePct ?? 15,
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث برقم المستحق أو الفترة...'
      : 'Search by due code or period...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد مستحقات مطابقة.' : 'No matching dues.',
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

  readonly commissionLines = computed(() =>
    (this.facade.data()?.lines ?? []).filter(
      (line) => line.kind === 'commission',
    ),
  );

  readonly filteredCommissionLines = computed(() => {
    const query = this.facade.search().trim().toLowerCase();
    const lines = this.commissionLines();
    if (!query) return lines;
    return lines.filter((line) => {
      const haystack = [
        line.code,
        line.title.ar,
        line.title.en,
        line.detail.ar,
        line.detail.en,
        line.periodLabel.ar,
        line.periodLabel.en,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly pendingCount = computed(
    () =>
      (this.facade.filterCounts().pending ?? 0) +
      (this.facade.filterCounts().scheduled ?? 0),
  );

  constructor() {
    effect(() => {
      const section = this.routeSection() ?? 'ledger';
      this.activeSection.set(section);
      if (section === 'ledger') {
        this.facade.setFilter('all');
      } else if (section === 'pending') {
        this.facade.setFilter('pending');
      }
    });
  }

  ngOnInit(): void {
    this.facade.load();
    if (!this.route.snapshot.queryParamMap.get('section')) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { section: 'ledger' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  sectionCardTitle(card: DueSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: DueSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: DueSection): number {
    switch (section) {
      case 'ledger':
        return this.facade.filterCounts().all ?? 0;
      case 'pending':
        return this.pendingCount();
      case 'commission':
        return this.commissionLines().length;
    }
  }

  openSection(section: DueSection): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }


  openDue(line: DueLine): void {
    void this.router.navigate(['/restaurant/finance/dues', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: DueFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: DueFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  lineTitle(line: DueLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: DueLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: DueLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: DueLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: DueStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'pending':
        return rtl ? 'معلّق' : 'Pending';
      case 'scheduled':
        return rtl ? 'مجدول' : 'Scheduled';
      case 'paid':
        return rtl ? 'مدفوع' : 'Paid';
      case 'held':
        return rtl ? 'موقوف' : 'Held';
    }
  }

  kindLabel(kind: DueKind): string {
    const rtl = this.locale.isRtl();
    switch (kind) {
      case 'box_payable':
        return rtl ? 'مستحق بوكسات' : 'Box payable';
      case 'commission':
        return rtl ? 'عمولة' : 'Commission';
      case 'net_settlement':
        return rtl ? 'صافي تسوية' : 'Net settlement';
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
