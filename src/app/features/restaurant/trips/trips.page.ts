import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideClock3,
  lucideInfo,
  lucideMapPinned,
  lucidePackage,
  lucidePlus,
  lucideRoute,
  lucideSearch,
  lucideUserRound,
  lucideUsers,
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
import { TripsFacade } from './data/trips.facade';
import { DeliveryTrip, TripFilter, TripStatus } from './models/trip.model';
import { TripsSkeletonComponent } from './trips-skeleton.component';

@Component({
  selector: 'mm-trips-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    TripsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './trips.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-tp-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideClock3,
      lucideInfo,
      lucideMapPinned,
      lucidePackage,
      lucidePlus,
      lucideRoute,
      lucideSearch,
      lucideUserRound,
      lucideUsers,
    }),
  ],
})
export class TripsPageComponent implements OnInit {
  readonly facade = inject(TripsFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: { id: TripFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'assigned', labelAr: 'مسنَدة', labelEn: 'Assigned' },
    { id: 'in_progress', labelAr: 'قيد التنفيذ', labelEn: 'In progress' },
    { id: 'completed', labelAr: 'مكتملة', labelEn: 'Completed' },
    { id: 'cancelled', labelAr: 'ملغاة', labelEn: 'Cancelled' },
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

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث برقم الرحلة أو السائق أو المنطقة...'
      : 'Search by trip, driver, or zone...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد رحلات مطابقة.'
      : 'No matching trips.',
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

  readonly readyBoxCount = computed(() =>
    (this.facade.data()?.candidates ?? []).reduce(
      (sum, item) => sum + item.boxCount,
      0,
    ),
  );

  ngOnInit(): void {
    this.facade.load();
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: TripFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: TripFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  zone(trip: DeliveryTrip): string {
    return pickLocale(trip.zoneLabel, this.locale.locale());
  }

  shift(trip: DeliveryTrip): string {
    return pickLocale(trip.shiftLabel, this.locale.locale());
  }

  driverName(trip: DeliveryTrip): string {
    return trip.driverName
      ? pickLocale(trip.driverName, this.locale.locale())
      : this.locale.isRtl()
        ? 'بدون سائق'
        : 'No driver';
  }

  driverInitial(trip: DeliveryTrip): string {
    const name = this.driverName(trip).trim();
    return name ? name.charAt(0) : '—';
  }

  deliveredCount(trip: DeliveryTrip): number {
    return trip.stops.filter((stop) => stop.status === 'delivered').length;
  }

  createdAt(trip: DeliveryTrip): string {
    return pickLocale(trip.createdAtLabel, this.locale.locale());
  }

  statusLabel(status: TripStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'draft':
        return rtl ? 'مسودة' : 'Draft';
      case 'assigned':
        return rtl ? 'مسنَدة' : 'Assigned';
      case 'in_progress':
        return rtl ? 'قيد التنفيذ' : 'In progress';
      case 'completed':
        return rtl ? 'مكتملة' : 'Completed';
      case 'cancelled':
        return rtl ? 'ملغاة' : 'Cancelled';
    }
  }

  prevPage(): void {
    this.facade.prevPage();
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  goToPage(page: number): void {
    this.facade.goToPage(page);
  }
}
