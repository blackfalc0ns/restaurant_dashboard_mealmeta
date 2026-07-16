import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCar,
  lucideCheck,
  lucideClock3,
  lucideInfo,
  lucideMapPinned,
  lucidePackage,
  lucideRoute,
  lucideTimer,
  lucideTriangleAlert,
  lucideTruck,
  lucideUserRound,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsMainComponent,
  RestaurantOpsSideCardComponent,
  RestaurantOpsSideComponent,
  RestaurantOpsSplitComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { DriversFacade } from '../drivers/data/drivers.facade';
import { RestaurantDriver } from '../drivers/models/driver.model';
import { TripsFacade } from './data/trips.facade';
import {
  DeliveryTrip,
  TripStatus,
  TripStop,
  TripStopStatus,
} from './models/trip.model';
import { TripsSkeletonComponent } from './trips-skeleton.component';

@Component({
  selector: 'mm-trip-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    TripsSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsSplitComponent,
    RestaurantOpsMainComponent,
    RestaurantOpsSideComponent,
    RestaurantOpsSideCardComponent,
  ],
  templateUrl: './trip-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-tp-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCar,
      lucideCheck,
      lucideClock3,
      lucideInfo,
      lucideMapPinned,
      lucidePackage,
      lucideRoute,
      lucideTimer,
      lucideTriangleAlert,
      lucideTruck,
      lucideUserRound,
      lucideUsers,
    }),
  ],
})
export class TripDetailPageComponent implements OnInit {
  readonly facade = inject(TripsFacade);
  readonly driversFacade = inject(DriversFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly tripId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('tripId') ?? '')),
    { initialValue: '' },
  );

  readonly trip = computed(() => {
    const id = this.tripId();
    if (!id || !this.facade.data()) return null;
    return this.facade.tripById(id);
  });

  readonly linkedDriver = computed(() => {
    const trip = this.trip();
    if (!trip?.driverId) return null;
    return this.driversFacade.driverById(trip.driverId);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.tripId() &&
      !this.trip(),
  );

  readonly deliveredCount = computed(() => {
    const trip = this.trip();
    if (!trip) return 0;
    return trip.stops.filter((s) => s.status === 'delivered').length;
  });

  readonly progressPercent = computed(() => {
    const trip = this.trip();
    if (!trip || trip.stops.length === 0) return 0;
    return Math.round((this.deliveredCount() / trip.stops.length) * 100);
  });

  ngOnInit(): void {
    this.facade.ensureLoaded();
    this.driversFacade.ensureLoaded();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
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
      : this.text('بدون سائق', 'No driver');
  }

  driverInitial(trip: DeliveryTrip): string {
    const name = this.driverName(trip).trim();
    return name ? name.charAt(0) : '—';
  }

  pickVehicle(driver: RestaurantDriver): string {
    return pickLocale(driver.vehicleLabel, this.locale.locale());
  }

  dispatcher(trip: DeliveryTrip): string {
    return pickLocale(trip.dispatcherName, this.locale.locale());
  }

  createdAt(trip: DeliveryTrip): string {
    return pickLocale(trip.createdAtLabel, this.locale.locale());
  }

  startedAt(trip: DeliveryTrip): string {
    return trip.startedAtLabel
      ? pickLocale(trip.startedAtLabel, this.locale.locale())
      : this.text('لم تبدأ', 'Not started');
  }

  completedAt(trip: DeliveryTrip): string {
    return trip.completedAtLabel
      ? pickLocale(trip.completedAtLabel, this.locale.locale())
      : '—';
  }

  note(trip: DeliveryTrip): string {
    return trip.note ? pickLocale(trip.note, this.locale.locale()) : '';
  }

  stopZone(stop: TripStop): string {
    return pickLocale(stop.zoneLabel, this.locale.locale());
  }

  stopMeal(stop: TripStop): string {
    return pickLocale(stop.mealSummary, this.locale.locale());
  }

  stopSlot(stop: TripStop): string {
    return pickLocale(stop.slotLabel, this.locale.locale());
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

  stopStatusLabel(status: TripStopStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'pending':
        return rtl ? 'بانتظار' : 'Pending';
      case 'picked_up':
        return rtl ? 'تم الاستلام' : 'Picked up';
      case 'delivered':
        return rtl ? 'تم التسليم' : 'Delivered';
      case 'failed':
        return rtl ? 'فشل' : 'Failed';
    }
  }

  stopIcon(status: TripStopStatus): string {
    switch (status) {
      case 'delivered':
        return 'lucideCheck';
      case 'picked_up':
        return 'lucideTruck';
      case 'failed':
        return 'lucideTriangleAlert';
      default:
        return 'lucideClock3';
    }
  }

  calloutIcon(status: TripStatus): string {
    if (status === 'cancelled') return 'lucideTriangleAlert';
    if (status === 'in_progress') return 'lucideTruck';
    return 'lucideInfo';
  }
}
