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
  lucideDownload,
  lucideFileText,
  lucideHandCoins,
  lucideHistory,
  lucideInfo,
  lucideLandmark,
  lucidePackage,
  lucideReceipt,
  lucideSearch,
  lucideShieldCheck,
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
import { PayoutsFacade } from './data/payouts.facade';
import { PayoutsSkeletonComponent } from './payouts-skeleton.component';
import {
  PayoutAllocation,
  PayoutLine,
  PayoutProofStatus,
  PayoutStatus,
  PayoutTimelineEvent,
  PayoutTransferProof,
} from './models/payouts.model';

const ALLOC_PAGE_SIZE = 6;

export type PayoutDetailWindow =
  | 'details'
  | 'allocations'
  | 'proof'
  | 'summary';

interface PayoutDetailWindowCard {
  id: PayoutDetailWindow;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-payout-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    PayoutsSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './payout-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideDownload,
      lucideFileText,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucideLandmark,
      lucidePackage,
      lucideReceipt,
      lucideSearch,
      lucideShieldCheck,
      lucideX,
    }),
  ],
})
export class PayoutDetailPageComponent implements OnInit {
  readonly facade = inject(PayoutsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly allocPage = signal(1);
  readonly allocPageSize = ALLOC_PAGE_SIZE;
  readonly activeWindow = signal<PayoutDetailWindow | null>(null);
  readonly allocSearch = signal('');
  readonly proofDownloaded = signal(false);

  private readonly payoutId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('payoutId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('payoutId') ?? '' },
  );

  private readonly routeWindow = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('window');
        return value === 'details' ||
          value === 'allocations' ||
          value === 'proof' ||
          value === 'summary'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('window');
        return value === 'details' ||
          value === 'allocations' ||
          value === 'proof' ||
          value === 'summary'
          ? value
          : null;
      })(),
    },
  );

  readonly line = computed(() => {
    const id = this.payoutId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.payoutId() &&
      !this.line(),
  );

  readonly allocations = computed(() => this.line()?.allocations ?? []);

  readonly filteredAllocations = computed(() => {
    const query = this.allocSearch().trim().toLowerCase();
    const items = this.allocations();
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

  readonly allocTotalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredAllocations().length / this.allocPageSize),
    ),
  );

  readonly pagedAllocations = computed(() => {
    const page = Math.min(this.allocPage(), this.allocTotalPages());
    const start = (page - 1) * this.allocPageSize;
    return this.filteredAllocations().slice(start, start + this.allocPageSize);
  });

  readonly allocPageNumbers = computed(() =>
    Array.from({ length: this.allocTotalPages() }, (_, index) => index + 1),
  );

  readonly allocRangeText = computed(() => {
    const total = this.filteredAllocations().length;
    if (total === 0) {
      return this.locale.isRtl() ? 'لا مصادر' : 'No sources';
    }
    const page = Math.min(this.allocPage(), this.allocTotalPages());
    const from = (page - 1) * this.allocPageSize + 1;
    const to = Math.min(page * this.allocPageSize, total);
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

  readonly windows = computed<PayoutDetailWindowCard[]>(() => [
    {
      id: 'details',
      icon: 'lucideLandmark',
      titleAr: 'بيانات التحويل',
      titleEn: 'Transfer details',
      detailAr: 'الحساب والمبلغ والحالة',
      detailEn: 'Account, amount, and status',
    },
    {
      id: 'allocations',
      icon: 'lucideReceipt',
      titleAr: 'مصادر الدفعة',
      titleEn: 'Payout sources',
      detailAr: 'الفواتير والمستحقات المرتبطة',
      detailEn: 'Linked invoices and dues',
    },
    {
      id: 'proof',
      icon: 'lucideShieldCheck',
      titleAr: 'إثبات التحويل',
      titleEn: 'Transfer proof',
      detailAr: 'إيصال البنك وملف التأكيد',
      detailEn: 'Bank receipt and confirmation file',
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

  readonly allocSearchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث في مصادر الدفعة...'
      : 'Search payout sources...',
  );

  readonly emptyAllocLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد مصادر مطابقة.' : 'No matching sources.',
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
      this.allocSearch();
      this.allocPage.set(1);
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

  windowCardTitle(card: PayoutDetailWindowCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  windowCardDetail(card: PayoutDetailWindowCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  windowCount(id: PayoutDetailWindow): number {
    const line = this.line();
    if (!line) return 0;
    switch (id) {
      case 'details':
        return 1;
      case 'allocations':
        return line.allocations.length;
      case 'proof':
        return line.proof?.status === 'ready' ? 1 : 0;
      case 'summary':
        return line.timeline.length;
    }
  }

  openWindow(id: PayoutDetailWindow): void {
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

  onAllocSearch(value: string): void {
    this.allocSearch.set(value);
  }

  title(line: PayoutLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: PayoutLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: PayoutLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  scheduledAt(line: PayoutLine): string {
    return pickLocale(line.scheduledAtLabel, this.locale.locale());
  }

  completedAt(line: PayoutLine): string {
    return line.completedAtLabel
      ? pickLocale(line.completedAtLabel, this.locale.locale())
      : '';
  }

  updatedAt(line: PayoutLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  method(line: PayoutLine): string {
    return pickLocale(line.methodLabel, this.locale.locale());
  }

  bank(line: PayoutLine): string {
    return pickLocale(line.bankLabel, this.locale.locale());
  }

  lineNote(line: PayoutLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  impactNote(line: PayoutLine): string {
    return line.impactNote
      ? pickLocale(line.impactNote, this.locale.locale())
      : '';
  }

  nextAction(line: PayoutLine): string {
    return line.nextAction
      ? pickLocale(line.nextAction, this.locale.locale())
      : '';
  }

  allocLabel(item: PayoutAllocation): string {
    return pickLocale(item.label, this.locale.locale());
  }

  allocDetail(item: PayoutAllocation): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  kindLabel(kind: PayoutAllocation['kind']): string {
    const rtl = this.locale.isRtl();
    return kind === 'invoice'
      ? rtl
        ? 'فاتورة'
        : 'Invoice'
      : rtl
        ? 'مستحق'
        : 'Due';
  }

  eventTitle(event: PayoutTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: PayoutTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  eventDetail(event: PayoutTimelineEvent): string {
    return event.detail ? pickLocale(event.detail, this.locale.locale()) : '';
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

  proofStatusLabel(status: PayoutProofStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'ready':
        return rtl ? 'جاهز' : 'Ready';
      case 'pending':
        return rtl ? 'قيد الانتظار' : 'Pending';
      case 'missing':
        return rtl ? 'غير متاح' : 'Unavailable';
    }
  }

  proofFileType(proof: PayoutTransferProof): string {
    return pickLocale(proof.fileTypeLabel, this.locale.locale());
  }

  proofFileSize(proof: PayoutTransferProof): string {
    return pickLocale(proof.fileSizeLabel, this.locale.locale());
  }

  proofUploadedAt(proof: PayoutTransferProof): string {
    return pickLocale(proof.uploadedAtLabel, this.locale.locale());
  }

  proofConfirmedAt(proof: PayoutTransferProof): string {
    return proof.confirmedAtLabel
      ? pickLocale(proof.confirmedAtLabel, this.locale.locale())
      : '';
  }

  proofBank(proof: PayoutTransferProof): string {
    return pickLocale(proof.bankLabel, this.locale.locale());
  }

  proofNote(proof: PayoutTransferProof): string {
    return proof.note ? pickLocale(proof.note, this.locale.locale()) : '';
  }

  downloadProof(line: PayoutLine): void {
    if (line.proof?.status !== 'ready') return;
    this.proofDownloaded.set(true);
    window.setTimeout(() => this.proofDownloaded.set(false), 2500);
  }

  goToAllocPage(page: number): void {
    this.allocPage.set(Math.min(Math.max(1, page), this.allocTotalPages()));
  }

  nextAllocPage(): void {
    this.goToAllocPage(this.allocPage() + 1);
  }

  prevAllocPage(): void {
    this.goToAllocPage(this.allocPage() - 1);
  }
}
