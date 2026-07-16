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
  lucideCar,
  lucideIdCard,
  lucideInfo,
  lucideLoaderCircle,
  lucidePause,
  lucidePhone,
  lucidePlay,
  lucideSearch,
  lucideTriangleAlert,
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
import { DriversFacade } from './data/drivers.facade';
import { DriversSkeletonComponent } from './drivers-skeleton.component';
import {
  DriverFilter,
  DriverStatus,
  RestaurantDriver,
} from './models/driver.model';

@Component({
  selector: 'mm-drivers-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DriversSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './drivers.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-dr-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideCar,
      lucideIdCard,
      lucideInfo,
      lucideLoaderCircle,
      lucidePause,
      lucidePhone,
      lucidePlay,
      lucideSearch,
      lucideTriangleAlert,
      lucideUsers,
    }),
  ],
})
export class DriversPageComponent implements OnInit {
  readonly facade = inject(DriversFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: { id: DriverFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'مفعّل', labelEn: 'Active' },
    { id: 'pending', labelAr: 'بانتظار الاعتماد', labelEn: 'Pending' },
    { id: 'license_alert', labelAr: 'تنبيه رخصة', labelEn: 'License alert' },
    { id: 'disabled', labelAr: 'معطّل', labelEn: 'Disabled' },
    { id: 'rejected', labelAr: 'مرفوض', labelEn: 'Rejected' },
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
      ? 'ابحث بالاسم أو الهاتف أو اللوحة...'
      : 'Search by name, phone, or plate...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا يوجد سائقون مطابقون للبحث أو التصفية.'
      : 'No drivers match this search or filter.',
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

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: DriverFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: DriverFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  driverName(driver: RestaurantDriver): string {
    return pickLocale(driver.name, this.locale.locale());
  }

  vehicleLabel(driver: RestaurantDriver): string {
    return pickLocale(driver.vehicleLabel, this.locale.locale());
  }

  licenseExpiry(driver: RestaurantDriver): string {
    return pickLocale(driver.licenseExpiryLabel, this.locale.locale());
  }

  updatedAt(driver: RestaurantDriver): string {
    return pickLocale(driver.updatedAtLabel, this.locale.locale());
  }

  driverNote(driver: RestaurantDriver): string {
    return driver.note ? pickLocale(driver.note, this.locale.locale()) : '';
  }

  statusLabel(status: DriverStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'active':
        return rtl ? 'مفعّل' : 'Active';
      case 'disabled':
        return rtl ? 'معطّل' : 'Disabled';
      case 'pending':
        return rtl ? 'بانتظار الاعتماد' : 'Pending approval';
      case 'rejected':
        return rtl ? 'مرفوض' : 'Rejected';
      case 'license_alert':
        return rtl ? 'تنبيه رخصة' : 'License alert';
    }
  }

  canToggle(driver: RestaurantDriver): boolean {
    return (
      driver.status === 'active' ||
      driver.status === 'disabled' ||
      driver.status === 'license_alert'
    );
  }

  isToggling(driver: RestaurantDriver): boolean {
    return this.facade.togglingId() === driver.id;
  }

  toggleLabel(driver: RestaurantDriver): string {
    const rtl = this.locale.isRtl();
    if (driver.status === 'disabled') {
      return rtl ? 'تفعيل' : 'Enable';
    }
    return rtl ? 'تعطيل' : 'Disable';
  }

  toggle(event: Event, driver: RestaurantDriver): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.canToggle(driver) || this.isToggling(driver)) return;
    this.facade.toggleEnabled(driver.id);
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
