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
  lucideArrowRight,
  lucideCalendarDays,
  lucideChefHat,
  lucideChevronLeft,
  lucideChevronRight,
  lucideClipboardList,
  lucidePackageCheck,
  lucidePrinter,
  lucideSearch,
  lucideTruck,
  lucideUserRound,
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
import { DailyOrdersFacade } from './data/daily-orders.facade';
import { DailyOrdersSkeletonComponent } from './daily-orders-skeleton.component';
import {
  DailyOrderFilter,
  DailyOrderItem,
  DailyOrderStatus,
  DailyOrderSummary,
  DailyShift,
} from './models/daily-orders.model';

@Component({
  selector: 'mm-daily-orders-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DailyOrdersSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
    RestaurantWorkspaceStatsComponent,
    RestaurantWorkspaceStatComponent,
    RestaurantWorkspaceToolbarComponent,
    RestaurantWorkspaceFiltersComponent,
    RestaurantWorkspacePanelComponent,
  ],
  templateUrl: './daily-orders.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-do-page block' },
  viewProviders: [
    provideIcons({
      lucideArchive,
      lucideArrowRight,
      lucideCalendarDays,
      lucideChefHat,
      lucideChevronLeft,
      lucideChevronRight,
      lucideClipboardList,
      lucidePackageCheck,
      lucidePrinter,
      lucideSearch,
      lucideTruck,
      lucideUserRound,
    }),
  ],
})
export class DailyOrdersPageComponent implements OnInit {
  readonly facade = inject(DailyOrdersFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{ id: DailyOrderFilter; labelAr: string; labelEn: string }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'preparing', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
    { id: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
    { id: 'waiting-driver', labelAr: 'مع السائق', labelEn: 'With driver' },
    { id: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
  ];

  readonly shifts: Array<{ id: DailyShift; labelAr: string; labelEn: string }> = [
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

  readonly printLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.printLabel, this.locale.locale()) : '';
  });

  readonly archiveLabel = computed(() =>
    this.locale.isRtl() ? 'أرشيف الطلبات' : 'Orders archive',
  );

  readonly moveToArchiveLabel = computed(() =>
    this.locale.isRtl() ? 'أرشفة' : 'Archive',
  );

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة طلبات اليوم' : 'Today’s order list',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'بدون بيانات عميل شخصية · رموز الطلب والسائق فقط'
      : 'No customer PII · order and driver codes only',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث برقم الطلب أو الوجبة أو السائق'
      : 'Search by order, meal, or driver',
  );

  readonly shiftLabel = computed(() =>
    this.locale.isRtl() ? 'الوردية' : 'Shift',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد طلبات مطابقة للتصفية الحالية'
      : 'No orders match the current filters',
  );

  readonly noDriverLabel = computed(() =>
    this.locale.isRtl() ? 'لم يُعيَّن بعد' : 'Not assigned yet',
  );

  readonly boxesLabel = computed(() =>
    this.locale.isRtl() ? 'صناديق' : 'boxes',
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

  filterCount(id: DailyOrderFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: DailyOrderSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: DailyOrderSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealName(order: DailyOrderItem): string {
    return pickLocale(order.mealName, this.locale.locale());
  }

  programLabel(order: DailyOrderItem): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  shiftText(order: DailyOrderItem): string {
    return pickLocale(order.shiftLabel, this.locale.locale());
  }

  windowLabel(order: DailyOrderItem): string {
    return pickLocale(order.windowLabel, this.locale.locale());
  }

  actionLabel(order: DailyOrderItem): string {
    return pickLocale(order.actionLabel, this.locale.locale());
  }

  driverLabel(order: DailyOrderItem): string {
    return order.driverLabel
      ? pickLocale(order.driverLabel, this.locale.locale())
      : this.noDriverLabel();
  }

  statusLabel(status: DailyOrderStatus): string {
    const map: Record<DailyOrderStatus, { ar: string; en: string }> = {
      preparing: { ar: 'قيد التحضير', en: 'Preparing' },
      ready: { ar: 'جاهز', en: 'Ready' },
      'waiting-driver': { ar: 'مع السائق', en: 'With driver' },
      completed: { ar: 'مكتمل', en: 'Completed' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  setFilter(filter: DailyOrderFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onShiftChange(value: string): void {
    this.facade.setShift(value as DailyShift);
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

  archiveOrder(order: DailyOrderItem): void {
    this.facade.archiveOrder(order.id);
  }
}
