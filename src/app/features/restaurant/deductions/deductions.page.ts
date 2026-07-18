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
  lucidePackage,
  lucideReceipt,
  lucideScale,
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
import { DeductionsFacade } from './data/deductions.facade';
import { DeductionsSkeletonComponent } from './deductions-skeleton.component';
import {
  DeductionFilter,
  DeductionKind,
  DeductionLine,
  DeductionStatus,
} from './models/deductions.model';

export type DeductionSection = 'ledger' | 'open' | 'applied';

interface DeductionSectionCard {
  id: DeductionSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-deductions-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DeductionsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './deductions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideInfo,
      lucidePackage,
      lucideReceipt,
      lucideScale,
      lucideSearch,
      lucideShieldAlert,
    }),
  ],
})
export class DeductionsPageComponent implements OnInit {
  readonly facade = inject(DeductionsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<DeductionSection>('ledger');

  private readonly routeSection = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('section');
        return value === 'ledger' || value === 'open' || value === 'applied'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('section');
        return value === 'ledger' || value === 'open' || value === 'applied'
          ? value
          : null;
      })(),
    },
  );

  readonly sections: DeductionSectionCard[] = [
    {
      id: 'ledger',
      icon: 'lucideClipboardList',
      titleAr: 'سجل الخصومات',
      titleEn: 'Deductions ledger',
      detailAr: 'كل خصومات الشكاوى والتسويات',
      detailEn: 'All complaint deductions and adjustments',
    },
    {
      id: 'open',
      icon: 'lucideShieldAlert',
      titleAr: 'مفتوح / اعتراض',
      titleEn: 'Open / disputed',
      detailAr: 'بنود بانتظار الاعتماد أو قيد الاعتراض',
      detailEn: 'Lines awaiting approval or in dispute',
    },
    {
      id: 'applied',
      icon: 'lucideScale',
      titleAr: 'مطبّق / مُعاد',
      titleEn: 'Applied / reversed',
      detailAr: 'خصومات أُغلقت على المستحقات',
      detailEn: 'Deductions closed against payables',
    },
  ];

  readonly filters: { id: DeductionFilter; labelAr: string; labelEn: string }[] =
    [
      { id: 'all', labelAr: 'الكل', labelEn: 'All' },
      { id: 'pending', labelAr: 'معلّق', labelEn: 'Pending' },
      { id: 'applied', labelAr: 'مطبّق', labelEn: 'Applied' },
      { id: 'disputed', labelAr: 'اعتراض', labelEn: 'Disputed' },
      { id: 'reversed', labelAr: 'مُعاد', labelEn: 'Reversed' },
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
      ? 'ابحث برقم الخصم أو الشكوى...'
      : 'Search by deduction or complaint code...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد خصومات مطابقة.' : 'No matching deductions.',
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
      (this.facade.filterCounts().pending ?? 0) +
      (this.facade.filterCounts().disputed ?? 0),
  );

  readonly appliedCount = computed(
    () =>
      (this.facade.filterCounts().applied ?? 0) +
      (this.facade.filterCounts().reversed ?? 0),
  );

  constructor() {
    effect(() => {
      const section = this.routeSection() ?? 'ledger';
      this.activeSection.set(section);
      if (section === 'ledger') {
        this.facade.setFilter('all');
      } else if (section === 'open') {
        this.facade.setFilter('pending');
      } else if (section === 'applied') {
        this.facade.setFilter('applied');
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

  sectionCardTitle(card: DeductionSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: DeductionSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: DeductionSection): number {
    switch (section) {
      case 'ledger':
        return this.facade.filterCounts().all ?? 0;
      case 'open':
        return this.openCount();
      case 'applied':
        return this.appliedCount();
    }
  }

  openSection(section: DeductionSection): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }


  openLine(line: DeductionLine): void {
    void this.router.navigate(['/restaurant/finance/deductions', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: DeductionFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: DeductionFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  lineTitle(line: DeductionLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: DeductionLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: DeductionLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: DeductionLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: DeductionStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'pending':
        return rtl ? 'معلّق' : 'Pending';
      case 'applied':
        return rtl ? 'مطبّق' : 'Applied';
      case 'disputed':
        return rtl ? 'اعتراض' : 'Disputed';
      case 'reversed':
        return rtl ? 'مُعاد' : 'Reversed';
    }
  }

  kindLabel(kind: DeductionKind): string {
    const rtl = this.locale.isRtl();
    switch (kind) {
      case 'complaint':
        return rtl ? 'شكوى' : 'Complaint';
      case 'quality':
        return rtl ? 'جودة' : 'Quality';
      case 'remake':
        return rtl ? 'إعادة' : 'Remake';
      case 'adjustment':
        return rtl ? 'تسوية' : 'Adjustment';
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
