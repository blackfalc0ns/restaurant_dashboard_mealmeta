import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  DriverFilter,
  DriverStatus,
  RestaurantDriver,
  RestaurantDriversData,
} from '../models/driver.model';
import { DRIVERS_MOCK } from './drivers.mock';

export const DRIVERS_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class DriversFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantDriversData | null>(null);
  readonly filter = signal<DriverFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly togglingId = signal<string | null>(null);
  readonly pageSize = DRIVERS_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredDrivers = computed<RestaurantDriver[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.drivers.filter((driver) => {
      if (filter !== 'all' && driver.status !== filter) return false;
      if (!query) return true;

      const haystack = [
        driver.name.ar,
        driver.name.en,
        driver.phone,
        driver.email,
        driver.plateNumber,
        driver.licenseNumber,
        driver.vehicleLabel.ar,
        driver.vehicleLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<DriverFilter, number>>(() => {
    const data = this.data();
    const empty = {
      all: 0,
      active: 0,
      pending: 0,
      disabled: 0,
      rejected: 0,
      license_alert: 0,
    };
    if (!data) return empty;

    return {
      all: data.drivers.length,
      active: data.drivers.filter((d) => d.status === 'active').length,
      pending: data.drivers.filter((d) => d.status === 'pending').length,
      disabled: data.drivers.filter((d) => d.status === 'disabled').length,
      rejected: data.drivers.filter((d) => d.status === 'rejected').length,
      license_alert: data.drivers.filter((d) => d.status === 'license_alert')
        .length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredDrivers().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedDrivers = computed(() => {
    const items = this.filteredDrivers();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredDrivers().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  load(): void {
    this.clearLoadTimer();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(DRIVERS_MOCK);
      this.syncSummaries(mock);
      this.data.set(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  setFilter(filter: DriverFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    const next = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(next);
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

  driverById(id: string): RestaurantDriver | null {
    return this.data()?.drivers.find((driver) => driver.id === id) ?? null;
  }

  ensureLoaded(): void {
    this.load();
  }

  toggleEnabled(driverId: string): void {
    const data = this.data();
    if (!data || this.togglingId()) return;

    const target = data.drivers.find((d) => d.id === driverId);
    if (!target) return;
    if (target.status !== 'active' && target.status !== 'disabled' && target.status !== 'license_alert') {
      return;
    }

    this.togglingId.set(driverId);
    this.clearToggleTimer();

    this.toggleTimer = setTimeout(() => {
      const current = this.data();
      if (!current) return;

      const driver = current.drivers.find((d) => d.id === driverId);
      if (!driver) {
        this.togglingId.set(null);
        this.toggleTimer = null;
        return;
      }

      const enabling = driver.status === 'disabled';
      const nextStatus: DriverStatus = enabling
        ? driver.licenseExpiringSoon
          ? 'license_alert'
          : 'active'
        : 'disabled';

      const drivers: RestaurantDriver[] = current.drivers.map((item) => {
        if (item.id !== driverId) return item;
        return {
          ...item,
          status: nextStatus,
          updatedAtLabel: {
            ar: enabling ? 'تم التفعيل للتو' : 'تم التعطيل للتو',
            en: enabling ? 'Enabled just now' : 'Disabled just now',
          },
          note: enabling
            ? item.licenseExpiringSoon
              ? {
                  ar: 'الرخصة تقترب من الانتهاء — حدّث الوثيقة قبل الإيقاف التلقائي.',
                  en: 'License is nearing expiry — update the document before auto-suspension.',
                }
              : undefined
            : {
                ar: 'معتمد من الأدمن لكن معطّل من المطعم حاليًا.',
                en: 'Admin-approved but currently disabled by the restaurant.',
              },
          timeline: [
            {
              id: `evt-${Date.now()}`,
              title: {
                ar: enabling
                  ? 'المطعم فعّل السائق'
                  : 'المطعم عطّل السائق',
                en: enabling
                  ? 'Restaurant enabled the driver'
                  : 'Restaurant disabled the driver',
              },
              timeLabel: {
                ar: 'الآن',
                en: 'Just now',
              },
              tone: enabling ? 'ok' : 'neutral',
            },
            ...item.timeline,
          ],
        };
      });

      const next = { ...current, drivers };
      this.syncSummaries(next);
      this.data.set(next);
      this.togglingId.set(null);
      this.toggleTimer = null;
    }, 420);
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearToggleTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.togglingId.set(null);
  }

  private syncSummaries(data: RestaurantDriversData): void {
    data.summaries = [
      {
        id: 'active',
        label: { ar: 'مفعّلون', en: 'Active' },
        value: data.drivers.filter(
          (d) => d.status === 'active' || d.status === 'license_alert',
        ).length,
      },
      {
        id: 'pending',
        label: { ar: 'بانتظار الاعتماد', en: 'Pending approval' },
        value: data.drivers.filter((d) => d.status === 'pending').length,
      },
      {
        id: 'license',
        label: { ar: 'تنبيه رخصة', en: 'License alerts' },
        value: data.drivers.filter(
          (d) => d.licenseExpiringSoon || d.status === 'license_alert',
        ).length,
      },
    ];
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearToggleTimer(): void {
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
  }
}
