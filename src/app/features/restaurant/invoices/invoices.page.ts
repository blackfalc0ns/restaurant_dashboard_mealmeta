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
  lucideFileText,
  lucideInfo,
  lucidePackage,
  lucidePrinter,
  lucideSearch,
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
import { InvoicesFacade } from './data/invoices.facade';
import { InvoicesSkeletonComponent } from './invoices-skeleton.component';
import {
  InvoiceFilter,
  InvoiceLine,
  InvoiceStatus,
} from './models/invoices.model';

export type InvoiceSection = 'ledger' | 'open' | 'closed';

interface InvoiceSectionCard {
  id: InvoiceSection;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-invoices-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    InvoicesSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './invoices.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideFileText,
      lucideInfo,
      lucidePackage,
      lucidePrinter,
      lucideSearch,
    }),
  ],
})
export class InvoicesPageComponent implements OnInit {
  readonly facade = inject(InvoicesFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<InvoiceSection>('ledger');

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

  readonly sections: InvoiceSectionCard[] = [
    {
      id: 'ledger',
      icon: 'lucideClipboardList',
      titleAr: 'سجل الفواتير',
      titleEn: 'Invoice ledger',
      detailAr: 'كل الفواتير الشهرية',
      detailEn: 'All monthly invoices',
    },
    {
      id: 'open',
      icon: 'lucideFileText',
      titleAr: 'مفتوح / مسودة',
      titleEn: 'Open / draft',
      detailAr: 'مسودات وصادرة ومتأخرة',
      detailEn: 'Draft, issued, and overdue',
    },
    {
      id: 'closed',
      icon: 'lucidePrinter',
      titleAr: 'مدفوع / ملغى',
      titleEn: 'Paid / void',
      detailAr: 'فواتير أُغلقت أو أُلغيت',
      detailEn: 'Closed or voided invoices',
    },
  ];

  readonly filters: { id: InvoiceFilter; labelAr: string; labelEn: string }[] =
    [
      { id: 'all', labelAr: 'الكل', labelEn: 'All' },
      { id: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
      { id: 'issued', labelAr: 'صادرة', labelEn: 'Issued' },
      { id: 'paid', labelAr: 'مدفوعة', labelEn: 'Paid' },
      { id: 'overdue', labelAr: 'متأخرة', labelEn: 'Overdue' },
      { id: 'void', labelAr: 'ملغاة', labelEn: 'Void' },
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
      ? 'ابحث برقم الفاتورة أو المرجع...'
      : 'Search by invoice or transfer ref...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد فواتير مطابقة.' : 'No matching invoices.',
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
      (this.facade.filterCounts().issued ?? 0) +
      (this.facade.filterCounts().overdue ?? 0),
  );

  readonly closedCount = computed(
    () =>
      (this.facade.filterCounts().paid ?? 0) +
      (this.facade.filterCounts().void ?? 0),
  );

  constructor() {
    effect(() => {
      const section = this.routeSection() ?? 'ledger';
      this.activeSection.set(section);
      if (section === 'ledger') {
        this.facade.setFilter('all');
      } else if (section === 'open') {
        this.facade.setFilter('issued');
      } else if (section === 'closed') {
        this.facade.setFilter('paid');
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

  sectionCardTitle(card: InvoiceSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: InvoiceSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: InvoiceSection): number {
    switch (section) {
      case 'ledger':
        return this.facade.filterCounts().all ?? 0;
      case 'open':
        return this.openCount();
      case 'closed':
        return this.closedCount();
    }
  }

  openSection(section: InvoiceSection): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }


  openLine(line: InvoiceLine): void {
    void this.router.navigate(['/restaurant/finance/invoices', line.id]);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: InvoiceFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: InvoiceFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  summaryIsCount(card: { id: string }): boolean {
    return card.id === 'boxes';
  }

  lineTitle(line: InvoiceLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  lineDetail(line: InvoiceLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: InvoiceLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: InvoiceLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: InvoiceStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'draft':
        return rtl ? 'مسودة' : 'Draft';
      case 'issued':
        return rtl ? 'صادرة' : 'Issued';
      case 'paid':
        return rtl ? 'مدفوعة' : 'Paid';
      case 'overdue':
        return rtl ? 'متأخرة' : 'Overdue';
      case 'void':
        return rtl ? 'ملغاة' : 'Void';
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
