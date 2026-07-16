import { Injectable, computed, inject, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { DriversFacade } from '../../drivers/data/drivers.facade';
import { RestaurantDriver } from '../../drivers/models/driver.model';
import {
  DeliveryTrip,
  RestaurantTripsData,
  TripDriverOption,
  TripFilter,
  TripStop,
} from '../models/trip.model';
import { TRIPS_MOCK } from './trips.mock';

export const TRIPS_PAGE_SIZE = 8;

function driverCodeOf(driver: RestaurantDriver): string {
  return driver.id.replace(/^drv-/i, 'DRV-').toUpperCase();
}

function isAssignable(driver: RestaurantDriver): boolean {
  return driver.status === 'active' || driver.status === 'license_alert';
}

@Injectable({ providedIn: 'root' })
export class TripsFacade {
  private readonly driversFacade = inject(DriversFacade);

  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantTripsData | null>(null);
  readonly filter = signal<TripFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = TRIPS_PAGE_SIZE;

  /** Create-flow selection state. */
  readonly selectedStopIds = signal<string[]>([]);
  readonly selectedDriverId = signal<string | null>(null);
  readonly creating = signal(false);
  readonly createError = signal<string | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private createTimer: ReturnType<typeof setTimeout> | null = null;

  /** Drivers eligible for trip assignment — sourced from DriversFacade. */
  readonly assignableDrivers = computed<TripDriverOption[]>(() => {
    const drivers = this.driversFacade.data()?.drivers ?? [];
    return drivers.filter(isAssignable).map((driver) => ({
      id: driver.id,
      name: driver.name,
      code: driverCodeOf(driver),
      vehicleLabel: driver.vehicleLabel,
      tripsToday: this.tripsByDriverId(driver.id).filter(
        (trip) =>
          trip.status === 'assigned' || trip.status === 'in_progress',
      ).length,
      available: true,
    }));
  });

  readonly hasUnavailableDrivers = computed(() => {
    const all = this.driversFacade.data()?.drivers ?? [];
    if (all.length === 0) return false;
    return all.some((driver) => !isAssignable(driver));
  });

  readonly filteredTrips = computed<DeliveryTrip[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.trips.filter((trip) => {
      if (filter !== 'all' && trip.status !== filter) return false;
      if (!query) return true;

      const haystack = [
        trip.code,
        trip.driverCode ?? '',
        trip.driverName?.ar ?? '',
        trip.driverName?.en ?? '',
        trip.zoneLabel.ar,
        trip.zoneLabel.en,
        trip.dispatcherName.ar,
        trip.dispatcherName.en,
        ...trip.stops.flatMap((s) => [
          s.orderCode,
          s.customerMaskedId,
          s.zoneLabel.ar,
          s.zoneLabel.en,
        ]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<TripFilter, number>>(() => {
    const data = this.data();
    const empty: Record<TripFilter, number> = {
      all: 0,
      draft: 0,
      assigned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    if (!data) return empty;

    return {
      all: data.trips.length,
      draft: data.trips.filter((t) => t.status === 'draft').length,
      assigned: data.trips.filter((t) => t.status === 'assigned').length,
      in_progress: data.trips.filter((t) => t.status === 'in_progress').length,
      completed: data.trips.filter((t) => t.status === 'completed').length,
      cancelled: data.trips.filter((t) => t.status === 'cancelled').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredTrips().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedTrips = computed(() => {
    const items = this.filteredTrips();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredTrips().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  /** @deprecated use assignableDrivers — kept for template compatibility */
  readonly availableDrivers = this.assignableDrivers;

  readonly selectedStops = computed(() => {
    const ids = new Set(this.selectedStopIds());
    return (this.data()?.candidates ?? []).filter((c) => ids.has(c.id));
  });

  readonly selectedDriver = computed(() => {
    const id = this.selectedDriverId();
    if (!id) return null;
    return this.assignableDrivers().find((d) => d.id === id) ?? null;
  });

  readonly selectedBoxCount = computed(() =>
    this.selectedStops().reduce((sum, s) => sum + s.boxCount, 0),
  );

  readonly canCreate = computed(
    () =>
      this.selectedStopIds().length > 0 &&
      !!this.selectedDriverId() &&
      !this.creating(),
  );

  load(): void {
    this.clearLoadTimer();
    this.driversFacade.ensureLoaded();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(TRIPS_MOCK);
      this.syncSummaries(mock);
      this.data.set(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  ensureLoaded(): void {
    this.load();
  }

  setFilter(filter: TripFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  nextPage(): void {
    this.setPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.setPage(this.currentPage() - 1);
  }

  goToPage(page: number): void {
    this.setPage(page);
  }

  tripById(id: string): DeliveryTrip | null {
    return this.data()?.trips.find((trip) => trip.id === id) ?? null;
  }

  tripsByDriverId(driverId: string): DeliveryTrip[] {
    return (this.data()?.trips ?? []).filter(
      (trip) => trip.driverId === driverId,
    );
  }

  activeTripsByDriverId(driverId: string): DeliveryTrip[] {
    return this.tripsByDriverId(driverId).filter(
      (trip) =>
        trip.status === 'assigned' || trip.status === 'in_progress',
    );
  }

  tripCountByDriverId(driverId: string): number {
    return this.tripsByDriverId(driverId).length;
  }

  resetCreateDraft(): void {
    this.selectedStopIds.set([]);
    this.selectedDriverId.set(null);
    this.createError.set(null);
    this.creating.set(false);
  }

  toggleStop(stopId: string): void {
    const current = this.selectedStopIds();
    if (current.includes(stopId)) {
      this.selectedStopIds.set(current.filter((id) => id !== stopId));
    } else {
      this.selectedStopIds.set([...current, stopId]);
    }
    this.createError.set(null);
  }

  selectDriver(driverId: string): void {
    this.selectedDriverId.set(driverId);
    this.createError.set(null);
  }

  /**
   * Creates a trip from selected stops + driver (from DriversFacade).
   */
  createTrip(onDone: (tripId: string) => void): void {
    const data = this.data();
    if (!data || this.creating()) return;

    const stopIds = this.selectedStopIds();
    const driverId = this.selectedDriverId();
    if (stopIds.length === 0 || !driverId) {
      this.createError.set('missing');
      return;
    }

    const driver = this.driversFacade.driverById(driverId);
    if (!driver || !isAssignable(driver)) {
      this.createError.set('driver');
      return;
    }

    const selected = data.candidates.filter((c) => stopIds.includes(c.id));
    if (selected.length === 0) {
      this.createError.set('stops');
      return;
    }

    this.creating.set(true);
    this.createError.set(null);
    this.clearCreateTimer();

    this.createTimer = setTimeout(() => {
      const current = this.data();
      if (!current) {
        this.creating.set(false);
        return;
      }

      const zones = [...new Set(selected.map((s) => s.zoneLabel.ar))];
      const zonesEn = [...new Set(selected.map((s) => s.zoneLabel.en))];
      const seq = current.trips.length + 104;
      const tripId = `trip-${seq}`;
      const stops: TripStop[] = selected.map((c, index) => ({
        id: `st-new-${seq}-${index}`,
        orderCode: c.orderCode,
        customerMaskedId: c.customerMaskedId,
        zoneLabel: c.zoneLabel,
        mealSummary: c.mealSummary,
        boxCount: c.boxCount,
        slotLabel: c.slotLabel,
        status: 'pending',
      }));

      const newTrip: DeliveryTrip = {
        id: tripId,
        code: `TRP-${seq}`,
        status: 'assigned',
        shiftLabel: selected[0]?.shiftLabel ?? {
          ar: 'وردية',
          en: 'Shift',
        },
        zoneLabel: {
          ar: zones.join(' · '),
          en: zonesEn.join(' · '),
        },
        driverId: driver.id,
        driverName: driver.name,
        driverCode: driverCodeOf(driver),
        dispatcherName: {
          ar: 'أنت — مسئول التوصيل',
          en: 'You — dispatch',
        },
        stops,
        boxCount: stops.reduce((sum, s) => sum + s.boxCount, 0),
        customerCount: stops.length,
        createdAtLabel: { ar: 'الآن', en: 'Just now' },
        startedAtLabel: null,
        completedAtLabel: null,
        note: {
          ar: 'تم إنشاء الرحلة وتعيين السائق — بانتظار الاستلام.',
          en: 'Trip created and driver assigned — awaiting pickup.',
        },
      };

      const next: RestaurantTripsData = {
        ...current,
        trips: [newTrip, ...current.trips],
        candidates: current.candidates.filter((c) => !stopIds.includes(c.id)),
      };
      this.syncSummaries(next);
      this.data.set(next);
      this.resetCreateDraft();
      this.creating.set(false);
      this.createTimer = null;
      onDone(tripId);
    }, 520);
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearCreateTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.resetCreateDraft();
  }

  private syncSummaries(data: RestaurantTripsData): void {
    data.summaries = [
      {
        id: 'active',
        label: { ar: 'قيد التنفيذ', en: 'In progress' },
        value: data.trips.filter((t) => t.status === 'in_progress').length,
      },
      {
        id: 'assigned',
        label: { ar: 'مسنَدة', en: 'Assigned' },
        value: data.trips.filter((t) => t.status === 'assigned').length,
      },
      {
        id: 'ready',
        label: { ar: 'بوكسات جاهزة', en: 'Ready boxes' },
        value: data.candidates.reduce((sum, c) => sum + c.boxCount, 0),
      },
    ];
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearCreateTimer(): void {
    if (this.createTimer) {
      clearTimeout(this.createTimer);
      this.createTimer = null;
    }
  }
}
