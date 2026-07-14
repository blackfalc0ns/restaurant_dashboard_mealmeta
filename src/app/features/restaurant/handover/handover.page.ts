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
  lucidePackage,
  lucideScanBarcode,
  lucideSearch,
  lucideTruck,
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
import { HandoverFacade } from './data/handover.facade';
import { HandoverSkeletonComponent } from './handover-skeleton.component';
import {
  HandoverFilter,
  HandoverListItem,
  HandoverShift,
  HandoverStatus,
  HandoverSummary,
} from './models/handover.model';

@Component({
  selector: 'mm-handover-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    HandoverSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './handover.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ho-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArchive,
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucidePackage,
      lucideScanBarcode,
      lucideSearch,
      lucideTruck,
    }),
  ],
})
export class HandoverPageComponent implements OnInit {
  readonly facade = inject(HandoverFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: HandoverFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    {
      id: 'awaiting-pickup',
      labelAr: 'بانتظار الاستلام',
      labelEn: 'Awaiting pickup',
    },
    { id: 'en-route', labelAr: 'مع المندوب', labelEn: 'With driver' },
    { id: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered' },
  ];

  readonly shifts: Array<{
    id: HandoverShift;
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

  readonly archiveLabel = computed(() =>
    this.locale.isRtl() ? 'أرشيف الطلبات' : 'Orders archive',
  );

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة التسليم' : 'Handover queue',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'بدون بيانات عميل شخصية · كود مندوب ومعرّف مقنّع فقط'
      : 'No customer PII · driver code & masked ID only',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث برقم الطلب أو المندوب أو الباركود'
      : 'Search by order, driver, or barcode',
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

  readonly moveToArchiveLabel = computed(() =>
    this.locale.isRtl() ? 'أرشفة' : 'Archive',
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

  filterCount(id: HandoverFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: HandoverSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: HandoverSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealSummary(order: HandoverListItem): string {
    return pickLocale(order.mealSummary, this.locale.locale());
  }

  programLabel(order: HandoverListItem): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  bundleLabel(order: HandoverListItem): string {
    return pickLocale(order.bundleLabel, this.locale.locale());
  }

  shiftText(order: HandoverListItem): string {
    return pickLocale(order.shiftLabel, this.locale.locale());
  }

  deliveryDate(order: HandoverListItem): string {
    return pickLocale(order.deliveryDateLabel, this.locale.locale());
  }

  deliverySlot(order: HandoverListItem): string {
    return pickLocale(order.deliverySlotLabel, this.locale.locale());
  }

  statusHint(order: HandoverListItem): string {
    return pickLocale(order.statusHint, this.locale.locale());
  }

  eta(order: HandoverListItem): string {
    return pickLocale(order.etaLabel, this.locale.locale());
  }

  pickedUpAt(order: HandoverListItem): string {
    return order.pickedUpAtLabel
      ? pickLocale(order.pickedUpAtLabel, this.locale.locale())
      : '';
  }

  boxesLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} بوكس`
      : `${count} box${count === 1 ? '' : 'es'}`;
  }

  statusLabel(status: HandoverStatus): string {
    const map: Record<HandoverStatus, { ar: string; en: string }> = {
      'awaiting-pickup': { ar: 'بانتظار الاستلام', en: 'Awaiting pickup' },
      'en-route': { ar: 'مع المندوب', en: 'With driver' },
      delivered: { ar: 'تم التسليم', en: 'Delivered' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  setFilter(filter: HandoverFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onShiftChange(value: string): void {
    this.facade.setShift(value as HandoverShift);
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

  archiveOrder(order: HandoverListItem): void {
    this.facade.archiveOrder(order.id);
  }
}
