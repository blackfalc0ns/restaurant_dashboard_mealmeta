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
  lucideBadgePercent,
  lucideFileText,
  lucideHandCoins,
  lucideHistory,
  lucideInfo,
  lucidePackage,
  lucidePrinter,
  lucideReceipt,
  lucideSearch,
  lucideX,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { InvoicesFacade } from './data/invoices.facade';
import { InvoicesSkeletonComponent } from './invoices-skeleton.component';
import {
  InvoiceLine,
  InvoiceLineItem,
  InvoiceStatus,
  InvoiceTimelineEvent,
} from './models/invoices.model';

const ITEMS_PAGE_SIZE = 6;

export type InvoiceDetailWindow = 'details' | 'lines' | 'summary';

interface InvoiceDetailWindowCard {
  id: InvoiceDetailWindow;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-invoice-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    InvoicesSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './invoice-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBadgePercent,
      lucideFileText,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucidePackage,
      lucidePrinter,
      lucideReceipt,
      lucideSearch,
      lucideX,
    }),
  ],
})
export class InvoiceDetailPageComponent implements OnInit {
  readonly facade = inject(InvoicesFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly itemsPage = signal(1);
  readonly itemsPageSize = ITEMS_PAGE_SIZE;
  readonly activeWindow = signal<InvoiceDetailWindow | null>(null);
  readonly itemSearch = signal('');

  private readonly invoiceId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('invoiceId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('invoiceId') ?? '' },
  );

  private readonly routeWindow = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('window');
        return value === 'details' || value === 'lines' || value === 'summary'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('window');
        return value === 'details' || value === 'lines' || value === 'summary'
          ? value
          : null;
      })(),
    },
  );

  readonly line = computed(() => {
    const id = this.invoiceId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.invoiceId() &&
      !this.line(),
  );

  readonly items = computed(() => this.line()?.lineItems ?? []);

  readonly filteredItems = computed(() => {
    const query = this.itemSearch().trim().toLowerCase();
    const list = this.items();
    if (!query) return list;
    return list.filter((item) => {
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

  readonly itemsTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredItems().length / this.itemsPageSize)),
  );

  readonly pagedItems = computed(() => {
    const page = Math.min(this.itemsPage(), this.itemsTotalPages());
    const start = (page - 1) * this.itemsPageSize;
    return this.filteredItems().slice(start, start + this.itemsPageSize);
  });

  readonly itemsPageNumbers = computed(() =>
    Array.from({ length: this.itemsTotalPages() }, (_, index) => index + 1),
  );

  readonly itemsRangeText = computed(() => {
    const total = this.filteredItems().length;
    if (total === 0) {
      return this.locale.isRtl() ? 'لا بنود' : 'No lines';
    }
    const page = Math.min(this.itemsPage(), this.itemsTotalPages());
    const from = (page - 1) * this.itemsPageSize + 1;
    const to = Math.min(page * this.itemsPageSize, total);
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

  readonly windows = computed<InvoiceDetailWindowCard[]>(() => [
    {
      id: 'details',
      icon: 'lucideFileText',
      titleAr: 'بيانات الفاتورة',
      titleEn: 'Invoice details',
      detailAr: 'الفترة والمبالغ والحالة',
      detailEn: 'Period, amounts, and status',
    },
    {
      id: 'lines',
      icon: 'lucideReceipt',
      titleAr: 'بنود الفاتورة',
      titleEn: 'Invoice lines',
      detailAr: 'تفصيل الإجمالي والعمولة والخصم',
      detailEn: 'Gross, commission, and deduction lines',
    },
    {
      id: 'summary',
      icon: 'lucideHandCoins',
      titleAr: 'الملخص والأحداث',
      titleEn: 'Summary & events',
      detailAr: 'الأثر والتايملاين والسياسة',
      detailEn: 'Impact, timeline, and policy',
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

  readonly itemSearchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث في بنود الفاتورة...'
      : 'Search invoice lines...',
  );

  readonly emptyItemsLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد بنود مطابقة.' : 'No matching lines.',
  );

  constructor() {
    effect(() => {
      const windowId = this.routeWindow();
      const available = this.windows().map((item) => item.id);
      if (windowId && available.includes(windowId)) {
        this.activeWindow.set(windowId);
        return;
      }
      this.activeWindow.set(null);
    });

    effect(() => {
      this.itemSearch();
      this.itemsPage.set(1);
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

  windowCardTitle(card: InvoiceDetailWindowCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  windowCardDetail(card: InvoiceDetailWindowCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  windowCount(id: InvoiceDetailWindow): number {
    const line = this.line();
    if (!line) return 0;
    switch (id) {
      case 'details':
        return 1;
      case 'lines':
        return line.lineItems.length;
      case 'summary':
        return line.timeline.length;
    }
  }

  openWindow(id: InvoiceDetailWindow): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { window: id },
      queryParamsHandling: 'merge',
    });
  }

  closeWindow(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { window: null },
      queryParamsHandling: 'merge',
    });
  }

  onItemSearch(value: string): void {
    this.itemSearch.set(value);
  }

  title(line: InvoiceLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: InvoiceLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: InvoiceLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  issuedAt(line: InvoiceLine): string {
    return pickLocale(line.issuedAtLabel, this.locale.locale());
  }

  dueAt(line: InvoiceLine): string {
    return pickLocale(line.dueAtLabel, this.locale.locale());
  }

  updatedAt(line: InvoiceLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  lineNote(line: InvoiceLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  impactNote(line: InvoiceLine): string {
    return line.impactNote
      ? pickLocale(line.impactNote, this.locale.locale())
      : '';
  }

  nextAction(line: InvoiceLine): string {
    return line.nextAction
      ? pickLocale(line.nextAction, this.locale.locale())
      : '';
  }

  itemLabel(item: InvoiceLineItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  itemDetail(item: InvoiceLineItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  toneLabel(tone: InvoiceLineItem['tone']): string {
    const rtl = this.locale.isRtl();
    switch (tone) {
      case 'gross':
        return rtl ? 'إجمالي' : 'Gross';
      case 'commission':
        return rtl ? 'عمولة' : 'Comm.';
      case 'deduction':
        return rtl ? 'خصم' : 'Deduct';
      case 'fee':
        return rtl ? 'رسوم' : 'Fee';
      case 'net':
        return rtl ? 'صافي' : 'Net';
    }
  }

  amountSign(amount: number): string {
    if (amount < 0) return '−';
    if (amount > 0) return '+';
    return '';
  }

  amountAbs(amount: number): number {
    return Math.abs(amount);
  }

  eventTitle(event: InvoiceTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: InvoiceTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  eventDetail(event: InvoiceTimelineEvent): string {
    return event.detail ? pickLocale(event.detail, this.locale.locale()) : '';
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

  deductionsTotal(line: InvoiceLine): number {
    return line.commissionKd + line.deductionsKd + line.feesKd;
  }

  goToItemsPage(page: number): void {
    this.itemsPage.set(
      Math.min(Math.max(1, page), this.itemsTotalPages()),
    );
  }

  nextItemsPage(): void {
    this.goToItemsPage(this.itemsPage() + 1);
  }

  prevItemsPage(): void {
    this.goToItemsPage(this.itemsPage() - 1);
  }
}
