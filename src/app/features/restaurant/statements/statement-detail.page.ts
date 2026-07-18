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
  lucideHandCoins,
  lucideHistory,
  lucideInfo,
  lucidePackage,
  lucideReceipt,
  lucideScrollText,
  lucideSearch,
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
import { StatementsFacade } from './data/statements.facade';
import { StatementsSkeletonComponent } from './statements-skeleton.component';
import {
  StatementEntry,
  StatementEntryKind,
  StatementLine,
  StatementStatus,
  StatementTimelineEvent,
} from './models/statements.model';

const ENTRIES_PAGE_SIZE = 8;

export type StatementDetailWindow = 'details' | 'entries' | 'summary';

interface StatementDetailWindowCard {
  id: StatementDetailWindow;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-statement-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    StatementsSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './statement-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucidePackage,
      lucideReceipt,
      lucideScrollText,
      lucideSearch,
    }),
  ],
})
export class StatementDetailPageComponent implements OnInit {
  readonly facade = inject(StatementsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly entriesPage = signal(1);
  readonly entriesPageSize = ENTRIES_PAGE_SIZE;
  readonly activeWindow = signal<StatementDetailWindow | null>(null);
  readonly entrySearch = signal('');

  private readonly statementId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('statementId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('statementId') ?? '' },
  );

  private readonly routeWindow = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('window');
        return value === 'details' || value === 'entries' || value === 'summary'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('window');
        return value === 'details' || value === 'entries' || value === 'summary'
          ? value
          : null;
      })(),
    },
  );

  readonly line = computed(() => {
    const id = this.statementId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.statementId() &&
      !this.line(),
  );

  readonly entries = computed(() => this.line()?.entries ?? []);

  readonly filteredEntries = computed(() => {
    const query = this.entrySearch().trim().toLowerCase();
    const items = this.entries();
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

  readonly entriesTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredEntries().length / this.entriesPageSize)),
  );

  readonly pagedEntries = computed(() => {
    const page = Math.min(this.entriesPage(), this.entriesTotalPages());
    const start = (page - 1) * this.entriesPageSize;
    return this.filteredEntries().slice(start, start + this.entriesPageSize);
  });

  readonly entriesPageNumbers = computed(() =>
    Array.from({ length: this.entriesTotalPages() }, (_, index) => index + 1),
  );

  readonly entriesRangeText = computed(() => {
    const total = this.filteredEntries().length;
    if (total === 0) {
      return this.locale.isRtl() ? 'لا حركات' : 'No entries';
    }
    const page = Math.min(this.entriesPage(), this.entriesTotalPages());
    const from = (page - 1) * this.entriesPageSize + 1;
    const to = Math.min(page * this.entriesPageSize, total);
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

  readonly windows = computed<StatementDetailWindowCard[]>(() => [
    {
      id: 'details',
      icon: 'lucideScrollText',
      titleAr: 'بيانات الكشف',
      titleEn: 'Statement details',
      detailAr: 'الفترة والأرصدة',
      detailEn: 'Period and balances',
    },
    {
      id: 'entries',
      icon: 'lucideReceipt',
      titleAr: 'الحركات',
      titleEn: 'Entries',
      detailAr: 'دائن ومدين ورصيد جاري',
      detailEn: 'Credits, debits, and running balance',
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

  readonly entrySearchPlaceholder = computed(() =>
    this.locale.isRtl() ? 'ابحث في الحركات...' : 'Search entries...',
  );

  readonly emptyEntriesLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد حركات مطابقة.' : 'No matching entries.',
  );

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
      this.entrySearch();
      this.entriesPage.set(1);
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

  windowCardTitle(card: StatementDetailWindowCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  windowCardDetail(card: StatementDetailWindowCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  windowCount(id: StatementDetailWindow): number {
    const line = this.line();
    if (!line) return 0;
    switch (id) {
      case 'details':
        return 1;
      case 'entries':
        return line.entries.length;
      case 'summary':
        return line.timeline.length;
    }
  }

  openWindow(id: StatementDetailWindow): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { window: id },
      queryParamsHandling: 'merge',
    });
  }


  onEntrySearch(value: string): void {
    this.entrySearch.set(value);
  }

  title(line: StatementLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: StatementLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: StatementLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  issuedAt(line: StatementLine): string {
    return pickLocale(line.issuedAtLabel, this.locale.locale());
  }

  updatedAt(line: StatementLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  lineNote(line: StatementLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  impactNote(line: StatementLine): string {
    return line.impactNote
      ? pickLocale(line.impactNote, this.locale.locale())
      : '';
  }

  nextAction(line: StatementLine): string {
    return line.nextAction
      ? pickLocale(line.nextAction, this.locale.locale())
      : '';
  }

  entryLabel(item: StatementEntry): string {
    return pickLocale(item.label, this.locale.locale());
  }

  entryDetail(item: StatementEntry): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  entryDate(item: StatementEntry): string {
    return pickLocale(item.dateLabel, this.locale.locale());
  }

  kindLabel(kind: StatementEntryKind): string {
    const rtl = this.locale.isRtl();
    switch (kind) {
      case 'opening':
        return rtl ? 'افتتاح' : 'Open';
      case 'box_credit':
        return rtl ? 'بوكسات' : 'Boxes';
      case 'commission':
        return rtl ? 'عمولة' : 'Comm.';
      case 'deduction':
        return rtl ? 'خصم' : 'Deduct';
      case 'fee':
        return rtl ? 'رسوم' : 'Fee';
      case 'payout':
        return rtl ? 'تحويل' : 'Payout';
      case 'adjustment':
        return rtl ? 'تسوية' : 'Adj.';
      case 'closing':
        return rtl ? 'ختام' : 'Close';
    }
  }

  entryTone(kind: StatementEntryKind): 'gross' | 'commission' | 'net' {
    if (kind === 'box_credit' || kind === 'opening' || kind === 'closing') {
      return kind === 'closing' || kind === 'opening' ? 'net' : 'gross';
    }
    return 'commission';
  }

  amountSign(amount: number): string {
    if (amount < 0) return '−';
    if (amount > 0) return '+';
    return '';
  }

  amountAbs(amount: number): number {
    return Math.abs(amount);
  }

  eventTitle(event: StatementTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: StatementTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  eventDetail(event: StatementTimelineEvent): string {
    return event.detail ? pickLocale(event.detail, this.locale.locale()) : '';
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

  goToEntriesPage(page: number): void {
    this.entriesPage.set(
      Math.min(Math.max(1, page), this.entriesTotalPages()),
    );
  }

  nextEntriesPage(): void {
    this.goToEntriesPage(this.entriesPage() + 1);
  }

  prevEntriesPage(): void {
    this.goToEntriesPage(this.entriesPage() - 1);
  }
}
