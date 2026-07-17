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
  lucideMapPinned,
  lucidePackage,
  lucideReceipt,
  lucideScale,
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
import { DeductionsFacade } from './data/deductions.facade';
import { DeductionsSkeletonComponent } from './deductions-skeleton.component';
import {
  DeductionBox,
  DeductionKind,
  DeductionLine,
  DeductionStatus,
  DeductionTimelineEvent,
} from './models/deductions.model';

const BOXES_PAGE_SIZE = 6;

export type DeductionDetailWindow = 'details' | 'boxes' | 'summary';

interface DeductionDetailWindowCard {
  id: DeductionDetailWindow;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-deduction-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DeductionsSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './deduction-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucideMapPinned,
      lucidePackage,
      lucideReceipt,
      lucideScale,
      lucideSearch,
      lucideX,
    }),
  ],
})
export class DeductionDetailPageComponent implements OnInit {
  readonly facade = inject(DeductionsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly boxesPage = signal(1);
  readonly boxesPageSize = BOXES_PAGE_SIZE;
  readonly activeWindow = signal<DeductionDetailWindow | null>(null);
  readonly boxSearch = signal('');

  private readonly deductionId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('deductionId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('deductionId') ?? '' },
  );

  private readonly routeWindow = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('window');
        return value === 'details' || value === 'boxes' || value === 'summary'
          ? value
          : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('window');
        return value === 'details' || value === 'boxes' || value === 'summary'
          ? value
          : null;
      })(),
    },
  );

  readonly line = computed(() => {
    const id = this.deductionId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.deductionId() &&
      !this.line(),
  );

  readonly boxes = computed(() => this.line()?.boxes ?? []);

  readonly filteredBoxes = computed(() => {
    const query = this.boxSearch().trim().toLowerCase();
    const items = this.boxes();
    if (!query) return items;
    return items.filter((box) => {
      const haystack = [
        box.boxCode,
        box.orderCode,
        box.customerMaskedId,
        box.contentsLabel.ar,
        box.contentsLabel.en,
        box.zoneLabel.ar,
        box.zoneLabel.en,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly boxesTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredBoxes().length / this.boxesPageSize)),
  );

  readonly pagedBoxes = computed(() => {
    const page = Math.min(this.boxesPage(), this.boxesTotalPages());
    const start = (page - 1) * this.boxesPageSize;
    return this.filteredBoxes().slice(start, start + this.boxesPageSize);
  });

  readonly boxesPageNumbers = computed(() =>
    Array.from({ length: this.boxesTotalPages() }, (_, index) => index + 1),
  );

  readonly boxesRangeText = computed(() => {
    const total = this.filteredBoxes().length;
    if (total === 0) {
      return this.locale.isRtl() ? 'لا بوكسات' : 'No boxes';
    }
    const page = Math.min(this.boxesPage(), this.boxesTotalPages());
    const from = (page - 1) * this.boxesPageSize + 1;
    const to = Math.min(page * this.boxesPageSize, total);
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

  readonly windows = computed<DeductionDetailWindowCard[]>(() => {
    const line = this.line();
    const items: DeductionDetailWindowCard[] = [
      {
        id: 'details',
        icon: 'lucideReceipt',
        titleAr: 'بيانات الخصم',
        titleEn: 'Deduction details',
        detailAr: 'التفصيل المالي للبند',
        detailEn: 'Financial breakdown for this line',
      },
    ];

    if ((line?.boxes?.length ?? 0) > 0) {
      items.push({
        id: 'boxes',
        icon: 'lucidePackage',
        titleAr: 'البوكسات المتأثرة',
        titleEn: 'Affected boxes',
        detailAr: 'البوكسات التي دخلت في الخصم',
        detailEn: 'Boxes included in this deduction',
      });
    }

    items.push({
      id: 'summary',
      icon: 'lucideHandCoins',
      titleAr: 'الملخص والأحداث',
      titleEn: 'Summary & events',
      detailAr: 'المبالغ والتايملاين والسياسة',
      detailEn: 'Amounts, timeline, and policy',
    });

    return items;
  });

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

  readonly boxSearchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث برقم البوكس أو الطلب...'
      : 'Search by box or order code...',
  );

  readonly emptyBoxesLabel = computed(() =>
    this.locale.isRtl() ? 'لا توجد بوكسات مطابقة.' : 'No matching boxes.',
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
      this.boxSearch();
      this.boxesPage.set(1);
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

  windowCardTitle(card: DeductionDetailWindowCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  windowCardDetail(card: DeductionDetailWindowCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  windowCount(id: DeductionDetailWindow): number {
    const line = this.line();
    if (!line) return 0;
    switch (id) {
      case 'details':
        return 1;
      case 'boxes':
        return line.boxes?.length ?? 0;
      case 'summary':
        return line.timeline.length;
    }
  }

  openWindow(id: DeductionDetailWindow): void {
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

  onBoxSearch(value: string): void {
    this.boxSearch.set(value);
  }

  title(line: DeductionLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: DeductionLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: DeductionLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: DeductionLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  lineNote(line: DeductionLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  eventTitle(event: DeductionTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: DeductionTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  contents(box: DeductionBox): string {
    return pickLocale(box.contentsLabel, this.locale.locale());
  }

  zone(box: DeductionBox): string {
    return pickLocale(box.zoneLabel, this.locale.locale());
  }

  deliveredAt(box: DeductionBox): string {
    return pickLocale(box.deliveredAtLabel, this.locale.locale());
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

  goToBoxesPage(page: number): void {
    this.boxesPage.set(
      Math.min(Math.max(1, page), this.boxesTotalPages()),
    );
  }

  nextBoxesPage(): void {
    this.goToBoxesPage(this.boxesPage() + 1);
  }

  prevBoxesPage(): void {
    this.goToBoxesPage(this.boxesPage() - 1);
  }
}
