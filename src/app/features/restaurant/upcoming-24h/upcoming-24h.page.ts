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
  lucideCheck,
  lucideChevronLeft,
  lucideChevronRight,
  lucideFileText,
  lucidePackage,
  lucidePrinter,
  lucideScanBarcode,
  lucideSearch,
  lucideTimer,
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
import { Upcoming24hFacade } from './data/upcoming-24h.facade';
import {
  Upcoming24hFilter,
  Upcoming24hItem,
  Upcoming24hPrepStatus,
  Upcoming24hShift,
  Upcoming24hSummary,
} from './models/upcoming-24h.model';
import { Upcoming24hSkeletonComponent } from './upcoming-24h-skeleton.component';

@Component({
  selector: 'mm-upcoming-24h-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    Upcoming24hSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
    RestaurantWorkspaceStatsComponent,
    RestaurantWorkspaceStatComponent,
    RestaurantWorkspaceToolbarComponent,
    RestaurantWorkspaceFiltersComponent,
    RestaurantWorkspacePanelComponent,
  ],
  templateUrl: './upcoming-24h.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-u24-page block' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideFileText,
      lucidePackage,
      lucidePrinter,
      lucideScanBarcode,
      lucideSearch,
      lucideTimer,
      lucideX,
    }),
  ],
})
export class Upcoming24hPageComponent implements OnInit {
  readonly facade = inject(Upcoming24hFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: Upcoming24hFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'needs-docs', labelAr: 'ينقص مستندات', labelEn: 'Needs docs' },
    { id: 'docs-ready', labelAr: 'مستندات جاهزة', labelEn: 'Docs ready' },
    { id: 'preparing', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
    { id: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
  ];

  readonly shifts: Array<{
    id: Upcoming24hShift;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الورديات', labelEn: 'All shifts' },
    { id: 'morning', labelAr: 'صباح', labelEn: 'Morning' },
    { id: 'noon', labelAr: 'ظهيرة', labelEn: 'Noon' },
    { id: 'evening', labelAr: 'مساء', labelEn: 'Evening' },
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

  readonly printLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.printLabel, this.locale.locale()) : '';
  });

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة التحضير النهائي' : 'Final prep list',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'بدون بيانات عميل شخصية · معرّف مقنّع فقط'
      : 'No customer PII · masked ID only',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث برقم الطلب أو الباقة أو المعرّف'
      : 'Search by order, package, or masked ID',
  );

  readonly shiftLabel = computed(() =>
    this.locale.isRtl() ? 'الوردية' : 'Shift',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد طلبات مطابقة للتصفية الحالية'
      : 'No orders match the current filters',
  );

  readonly detailsLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );

  readonly labelsActionLabel = computed(() =>
    this.locale.isRtl() ? 'الملصقات' : 'Labels',
  );

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
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

  filterCount(id: Upcoming24hFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: Upcoming24hSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: Upcoming24hSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealSummary(order: Upcoming24hItem): string {
    return pickLocale(order.mealSummary, this.locale.locale());
  }

  programLabel(order: Upcoming24hItem): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  bundleLabel(order: Upcoming24hItem): string {
    return pickLocale(order.bundleLabel, this.locale.locale());
  }

  shiftText(order: Upcoming24hItem): string {
    return pickLocale(order.shiftLabel, this.locale.locale());
  }

  deliveryDate(order: Upcoming24hItem): string {
    return pickLocale(order.deliveryDateLabel, this.locale.locale());
  }

  deliverySlot(order: Upcoming24hItem): string {
    return pickLocale(order.deliverySlotLabel, this.locale.locale());
  }

  hoursLeft(order: Upcoming24hItem): string {
    return this.locale.isRtl()
      ? `متبقي ${order.hoursToDelivery}س`
      : `${order.hoursToDelivery}h left`;
  }

  boxesLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} بوكس`
      : `${count} box${count === 1 ? '' : 'es'}`;
  }

  prepStatusLabel(status: Upcoming24hPrepStatus): string {
    const map: Record<Upcoming24hPrepStatus, { ar: string; en: string }> = {
      'needs-docs': { ar: 'ينقص مستندات', en: 'Needs docs' },
      'docs-ready': { ar: 'مستندات جاهزة', en: 'Docs ready' },
      preparing: { ar: 'قيد التحضير', en: 'Preparing' },
      ready: { ar: 'جاهز', en: 'Ready' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  docLabel(kind: 'invoice' | 'barcode' | 'labels'): string {
    const map = {
      invoice: { ar: 'فاتورة', en: 'Invoice' },
      barcode: { ar: 'باركود', en: 'Barcode' },
      labels: { ar: 'ملصقات', en: 'Labels' },
    };
    return this.locale.isRtl() ? map[kind].ar : map[kind].en;
  }

  setFilter(filter: Upcoming24hFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onShiftChange(value: string): void {
    this.facade.setShift(value as Upcoming24hShift);
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
