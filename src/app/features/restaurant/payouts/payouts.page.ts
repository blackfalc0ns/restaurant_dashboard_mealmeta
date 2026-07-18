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
  lucideInfo,
  lucideLandmark,
  lucidePackage,
  lucideSearch,
  lucideShieldAlert,
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
import { PayoutsFacade } from './data/payouts.facade';
import { PayoutsSkeletonComponent } from './payouts-skeleton.component';
import {
  PayoutFilter,
  PayoutLine,
  PayoutStatus,
} from './models/payouts.model';

export type PayoutSection = 'ledger' | 'open' | 'closed';

interface PayoutSectionCard {
  id: PayoutSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-payouts-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    PayoutsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './payouts.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideInfo,
      lucideLandmark,
      lucidePackage,
      lucideSearch,
      lucideShieldAlert,
    }),
  ],
})
export class PayoutsPageComponent implements OnInit {
  readonly facade = inject(PayoutsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<PayoutSection>('ledger');

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

  readonly sections: PayoutSectionCard[] = [
    {
      id: 'ledger',
      icon: 'lucideClipboardList',
      titleAr: 'سجل الدفعات',
      titleEn: 'Payout ledger',
      detailAr: 'كل التحويلات والدفعات',
      detailEn: 'All transfers and payouts',
    },
    {
      id: 'open',
      icon: 'lucideShieldAlert',
      titleAr: 'مفتوح / معلّق',
      titleEn: 'Open / held',
      detailAr: 'مجدول وقيد المعالجة وفاشل ومعلّق',
      detailEn: 'Scheduled, processing, failed, and held',
    },
    {
      id: 'closed',
      icon: 'lucideLandmark',
      titleAr: 'مكتمل',
      titleEn: 'Completed',
      detailAr: 'تحويلات وصلت للحساب',
      detailEn: 'Transfers credited to account',
    },
  ];

  readonly filters: { id: PayoutFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'scheduled', labelAr: 'مجدول', labelEn: 'Scheduled' },
    { id: 'processing', labelAr: 'قيد المعالجة', labelEn: 'Processing' },
    { id: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
    { id: 'failed', labelAr: 'فاشل', labelEn: 'Failed' },
    { id: 'held', labelAr: 'معلّق', labelEn: 'Held' },
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
      ? 'ابحث برقم الدفعة أو المرجع...'
      : 'Search by payout or transfer ref...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد دفعات مطابقة.' : 'No matching payouts.',
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
      (this.facade.filterCounts().scheduled ?? 0) +
      (this.facade.filterCounts().processing ?? 0) +
      (this.facade.filterCounts().failed ?? 0) +
      (this.facade.filterCounts().held ?? 0),
  );

  readonly closedCount = computed(
    () => this.facade.filterCounts().completed ?? 0,
  );

  constructor() {
    effect(() => {
      const section = this.routeSection() ?? 'ledger';
      this.activeSection.set(section);
      if (section === 'ledger') {
        this.facade.setFilter('all');
      } else if (section === 'open') {
        this.facade.setFilter('scheduled');
      } else if (section === 'closed') {
        this.facade.setFilter('completed');
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

  sectionCardTitle(card: PayoutSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: PayoutSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: PayoutSection): number {
    switch (section) {
      case 'ledger':
        return this.facade.filterCounts().all ?? 0;
      case 'open':
        return this.openCount();
      case 'closed':
        return this.closedCount();
    }
  }

  openSection(section: PayoutSection): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }


  openLine(line: PayoutLine): void {
    void this.router.navigate(['/restaurant/finance/payouts', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: PayoutFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: PayoutFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  lineTitle(line: PayoutLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: PayoutLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: PayoutLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: PayoutLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: PayoutStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'scheduled':
        return rtl ? 'مجدول' : 'Scheduled';
      case 'processing':
        return rtl ? 'قيد المعالجة' : 'Processing';
      case 'completed':
        return rtl ? 'مكتمل' : 'Completed';
      case 'failed':
        return rtl ? 'فاشل' : 'Failed';
      case 'held':
        return rtl ? 'معلّق' : 'Held';
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
