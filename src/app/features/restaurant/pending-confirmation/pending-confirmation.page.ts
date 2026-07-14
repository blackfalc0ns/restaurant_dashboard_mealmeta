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
  lucideCircleAlert,
  lucideClipboardList,
  lucideClock,
  lucideSearch,
  lucideTimer,
  lucideTriangleAlert,
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
import { PendingConfirmationFacade } from './data/pending-confirmation.facade';
import {
  ConfirmationUrgency,
  PendingConfirmationFilter,
  PendingConfirmationItem,
  PendingConfirmationSummary,
} from './models/pending-confirmation.model';
import { PendingConfirmationSkeletonComponent } from './pending-confirmation-skeleton.component';

@Component({
  selector: 'mm-pending-confirmation-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    PendingConfirmationSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './pending-confirmation.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-pc-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCircleAlert,
      lucideClipboardList,
      lucideClock,
      lucideSearch,
      lucideTimer,
      lucideTriangleAlert,
    }),
  ],
})
export class PendingConfirmationPageComponent implements OnInit {
  readonly facade = inject(PendingConfirmationFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: PendingConfirmationFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'critical', labelAr: 'حرج', labelEn: 'Critical' },
    { id: 'warning', labelAr: 'تنبيه', labelEn: 'Warning' },
    { id: 'normal', labelAr: 'عادي', labelEn: 'Normal' },
    { id: 'overdue', labelAr: 'متأخر', labelEn: 'Overdue' },
    { id: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
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
    this.locale.isRtl() ? 'قائمة التأكيد' : 'Confirmation queue',
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

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد طلبات مطابقة للتصفية الحالية'
      : 'No orders match the current filters',
  );

  readonly confirmLabel = computed(() =>
    this.locale.isRtl() ? 'تأكيد الطلب' : 'Confirm order',
  );

  readonly confirmedLabel = computed(() =>
    this.locale.isRtl() ? 'مؤكد' : 'Confirmed',
  );

  readonly detailsLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );

  readonly reassignedLabel = computed(() =>
    this.locale.isRtl() ? 'مُعاد تعيينه' : 'Reassigned',
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

  filterCount(id: PendingConfirmationFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: PendingConfirmationSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: PendingConfirmationSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealSummary(order: PendingConfirmationItem): string {
    return pickLocale(order.mealSummary, this.locale.locale());
  }

  programLabel(order: PendingConfirmationItem): string {
    return pickLocale(order.programLabel, this.locale.locale());
  }

  bundleLabel(order: PendingConfirmationItem): string {
    return pickLocale(order.bundleLabel, this.locale.locale());
  }

  deliveryDate(order: PendingConfirmationItem): string {
    return pickLocale(order.deliveryDateLabel, this.locale.locale());
  }

  deliverySlot(order: PendingConfirmationItem): string {
    return pickLocale(order.deliverySlotLabel, this.locale.locale());
  }

  receivedAt(order: PendingConfirmationItem): string {
    return pickLocale(order.receivedAtLabel, this.locale.locale());
  }

  deadline(order: PendingConfirmationItem): string {
    return pickLocale(order.deadlineLabel, this.locale.locale());
  }

  urgencyLabel(urgency: ConfirmationUrgency): string {
    const map: Record<ConfirmationUrgency, { ar: string; en: string }> = {
      critical: { ar: 'حرج', en: 'Critical' },
      warning: { ar: 'تنبيه', en: 'Warning' },
      normal: { ar: 'عادي', en: 'Normal' },
      overdue: { ar: 'متأخر', en: 'Overdue' },
    };
    return this.locale.isRtl() ? map[urgency].ar : map[urgency].en;
  }

  boxesLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} بوكس`
      : `${count} box${count === 1 ? '' : 'es'}`;
  }

  setFilter(filter: PendingConfirmationFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  confirm(order: PendingConfirmationItem): void {
    if (order.confirmed) return;
    this.facade.confirmOrder(order.id);
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
