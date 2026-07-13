import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  ArchiveData,
  ArchiveFilter,
  ArchiveOrderItem,
  ArchivePeriod,
  ArchiveShift,
} from '../models/archive.model';
import { ARCHIVE_MOCK } from './archive.mock';

export const ARCHIVE_PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class ArchiveFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<ArchiveData | null>(null);
  readonly filter = signal<ArchiveFilter>('all');
  readonly shift = signal<ArchiveShift>('all');
  readonly period = signal<ArchivePeriod>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = ARCHIVE_PAGE_SIZE;

  readonly filteredOrders = computed<ArchiveOrderItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const shift = this.shift();
    const period = this.period();
    const query = this.search().trim().toLowerCase();

    return data.orders.filter((order) => {
      if (filter !== 'all' && order.status !== filter) return false;
      if (shift !== 'all' && order.shift !== shift) return false;
      if (period !== 'all' && order.period !== period) return false;
      if (!query) return true;

      const haystack = [
        order.orderCode,
        order.batchCode,
        order.customerMaskedId,
        order.driverCode ?? '',
        order.barcodeCode ?? '',
        order.mealSummary.ar,
        order.mealSummary.en,
        order.programLabel.ar,
        order.programLabel.en,
        order.settlementLabel.ar,
        order.settlementLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<ArchiveFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, delivered: 0, cancelled: 0, complaint: 0 };
    if (!data) return empty;

    const period = this.period();
    const shift = this.shift();
    const scoped = data.orders.filter((order) => {
      if (period !== 'all' && order.period !== period) return false;
      if (shift !== 'all' && order.shift !== shift) return false;
      return true;
    });

    return {
      all: scoped.length,
      delivered: scoped.filter((o) => o.status === 'delivered').length,
      cancelled: scoped.filter((o) => o.status === 'cancelled').length,
      complaint: scoped.filter((o) => o.status === 'complaint').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredOrders().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedOrders = computed<ArchiveOrderItem[]>(() => {
    const orders = this.filteredOrders();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return orders.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredOrders().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearTimer();
    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(ARCHIVE_MOCK);
      this.data.set(mock);
      this.syncSummaries(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: ArchiveFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setShift(shift: ArchiveShift): void {
    this.shift.set(shift);
    this.currentPage.set(1);
  }

  setPeriod(period: ArchivePeriod): void {
    this.period.set(period);
    this.currentPage.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  retry(): void {
    this.load();
  }

  /** Prepend a newly archived order (keeps session data even before first visit). */
  prependOrder(item: ArchiveOrderItem): void {
    const current = this.data();
    if (!current) {
      const seed = structuredClone(ARCHIVE_MOCK);
      seed.orders = [item, ...seed.orders.filter((o) => o.orderCode !== item.orderCode)];
      this.syncSummaries(seed);
      return;
    }

    const next: ArchiveData = {
      ...current,
      orders: [
        item,
        ...current.orders.filter((o) => o.orderCode !== item.orderCode),
      ],
    };
    this.syncSummaries(next);
  }

  reset(): void {
    this.clearTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.shift.set('all');
    this.period.set('all');
    this.search.set('');
    this.currentPage.set(1);
  }

  private syncSummaries(data: ArchiveData): void {
    const byId: Record<string, number> = {
      delivered: data.orders.filter((o) => o.status === 'delivered').length,
      cancelled: data.orders.filter((o) => o.status === 'cancelled').length,
      complaint: data.orders.filter((o) => o.status === 'complaint').length,
      boxes: data.orders.reduce((sum, o) => sum + o.boxCount, 0),
    };

    this.data.set({
      ...data,
      summaries: data.summaries.map((card) => ({
        ...card,
        value: byId[card.id] ?? card.value,
      })),
    });
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
