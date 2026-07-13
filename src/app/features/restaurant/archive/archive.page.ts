import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideCheck,
  lucideChevronLeft,
  lucideChevronRight,
  lucideSearch,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantWorkspaceFiltersComponent,
  RestaurantWorkspaceHeaderComponent,
  RestaurantWorkspacePanelComponent,
  RestaurantWorkspaceStatComponent,
  RestaurantWorkspaceStatsComponent,
  RestaurantWorkspaceToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-workspace-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { ArchiveFacade } from './data/archive.facade';
import { ArchiveSkeletonComponent } from './archive-skeleton.component';
import {
  ArchiveFilter,
  ArchiveOrderItem,
  ArchivePeriod,
  ArchiveShift,
  ArchiveStatus,
  ArchiveSummary,
} from './models/archive.model';

@Component({
  selector: 'mm-archive-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    ArchiveSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
    RestaurantWorkspaceStatsComponent,
    RestaurantWorkspaceStatComponent,
    RestaurantWorkspaceToolbarComponent,
    RestaurantWorkspaceFiltersComponent,
    RestaurantWorkspacePanelComponent,
  ],
  templateUrl: './archive.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-oa-page block' },
  viewProviders: [
    provideIcons({
      lucideArchive,
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideSearch,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class ArchivePageComponent implements OnInit {
  readonly facade = inject(ArchiveFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: ArchiveFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered' },
    { id: 'cancelled', labelAr: 'ملغى', labelEn: 'Cancelled' },
    { id: 'complaint', labelAr: 'شكاوى', labelEn: 'Complaints' },
  ];

  readonly shifts: Array<{
    id: ArchiveShift;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الورديات', labelEn: 'All shifts' },
    { id: 'morning', labelAr: 'صباح', labelEn: 'Morning' },
    { id: 'noon', labelAr: 'ظهيرة', labelEn: 'Noon' },
    { id: 'evening', labelAr: 'مساء', labelEn: 'Evening' },
  ];

  readonly periods: Array<{
    id: ArchivePeriod;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الفترات', labelEn: 'All periods' },
    { id: 'today', labelAr: 'اليوم', labelEn: 'Today' },
    { id: 'week', labelAr: 'هذا الأسبوع', labelEn: 'This week' },
    { id: 'month', labelAr: 'هذا الشهر', labelEn: 'This month' },
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

  readonly windowHint = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.windowHint, this.locale.locale()) : '';
  });

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'الطلبات المؤرشفة' : 'Archived orders',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'مراجعة التسويات والتقييمات والشكاوى'
      : 'Review settlements, ratings, and complaints',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث برقم الطلب أو المندوب أو التسوية'
      : 'Search by order, driver, or settlement',
  );

  readonly shiftLabel = computed(() =>
    this.locale.isRtl() ? 'الوردية' : 'Shift',
  );

  readonly periodLabel = computed(() =>
    this.locale.isRtl() ? 'الفترة' : 'Period',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد طلبات مطابقة للتصفية الحالية'
      : 'No orders match the current filters',
  );

  readonly detailsLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly unassignedLabel = computed(() =>
    this.locale.isRtl() ? 'بدون مندوب' : 'No driver',
  );

  readonly noBarcodeLabel = computed(() =>
    this.locale.isRtl() ? 'بدون باركود' : 'No barcode',
  );

  readonly rangeText = computed(() => {
    const range = this.facade.rangeLabel();
    if (range.total === 0) {
      return this.locale.isRtl() ? 'لا عناصر' : 'No items';
    }
    return this.locale.isRtl()
      ? `عرض ${range.from}–${range.to} من ${range.total}`
      : `Showing ${range.from}–${range.to} of ${range.total}`;
  });

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: ArchiveFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: ArchiveSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: ArchiveSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealSummary(order: ArchiveOrderItem): string {
    return pickLocale(order.mealSummary, this.locale.locale());
  }

  programLabel(order: ArchiveOrderItem): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  bundleLabel(order: ArchiveOrderItem): string {
    return pickLocale(order.bundleLabel, this.locale.locale());
  }

  shiftText(order: ArchiveOrderItem): string {
    return pickLocale(order.shiftLabel, this.locale.locale());
  }

  deliveryDate(order: ArchiveOrderItem): string {
    return pickLocale(order.deliveryDateLabel, this.locale.locale());
  }

  deliverySlot(order: ArchiveOrderItem): string {
    return pickLocale(order.deliverySlotLabel, this.locale.locale());
  }

  closedAt(order: ArchiveOrderItem): string {
    return pickLocale(order.closedAtLabel, this.locale.locale());
  }

  statusHint(order: ArchiveOrderItem): string {
    return pickLocale(order.statusHint, this.locale.locale());
  }

  settlement(order: ArchiveOrderItem): string {
    return pickLocale(order.settlementLabel, this.locale.locale());
  }

  rating(order: ArchiveOrderItem): string {
    return order.ratingLabel
      ? pickLocale(order.ratingLabel, this.locale.locale())
      : '';
  }

  boxesLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} بوكس`
      : `${count} box${count === 1 ? '' : 'es'}`;
  }

  statusLabel(status: ArchiveStatus): string {
    const map: Record<ArchiveStatus, { ar: string; en: string }> = {
      delivered: { ar: 'تم التسليم', en: 'Delivered' },
      cancelled: { ar: 'ملغى', en: 'Cancelled' },
      complaint: { ar: 'شكوى', en: 'Complaint' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  setFilter(filter: ArchiveFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onShiftChange(value: string): void {
    this.facade.setShift(value as ArchiveShift);
  }

  onPeriodChange(value: string): void {
    this.facade.setPeriod(value as ArchivePeriod);
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
