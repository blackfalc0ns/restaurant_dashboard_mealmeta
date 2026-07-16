import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgePercent,
  lucideHandCoins,
  lucideInfo,
  lucidePackage,
  lucideSearch,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
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
    RestaurantOpsBoardComponent,
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
      lucideHandCoins,
      lucideInfo,
      lucidePackage,
      lucideSearch,
    }),
  ],
})
export class DuesPageComponent implements OnInit {
  readonly facade = inject(DuesFacade);
  readonly locale = inject(AppLocaleService);

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

  ngOnInit(): void {
    this.facade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
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
      case 'meal_payable':
        return rtl ? 'مستحق وجبات' : 'Meal payable';
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
