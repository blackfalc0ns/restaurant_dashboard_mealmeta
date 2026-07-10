import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  DailyOrderFilter,
  DailyOrderItem,
  DailyOrdersData,
  DailyShift,
} from '../models/daily-orders.model';
import { DAILY_ORDERS_MOCK } from './daily-orders.mock';

export const DAILY_ORDERS_PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class DailyOrdersFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<DailyOrdersData | null>(null);
  readonly filter = signal<DailyOrderFilter>('all');
  readonly shift = signal<DailyShift>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = DAILY_ORDERS_PAGE_SIZE;

  readonly filteredOrders = computed<DailyOrderItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const shift = this.shift();
    const query = this.search().trim().toLowerCase();

    return data.orders.filter((order) => {
      if (filter !== 'all' && order.status !== filter) return false;
      if (shift !== 'all' && order.shift !== shift) return false;
      if (!query) return true;

      const haystack = [
        order.orderCode,
        order.batchCode,
        order.mealName.ar,
        order.mealName.en,
        order.programLabel.ar,
        order.programLabel.en,
        order.driverLabel?.ar ?? '',
        order.driverLabel?.en ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<DailyOrderFilter, number>>(() => {
    const data = this.data();
    const empty = {
      all: 0,
      preparing: 0,
      ready: 0,
      'waiting-driver': 0,
      completed: 0,
    };
    if (!data) return empty;

    return {
      all: data.orders.length,
      preparing: data.orders.filter((o) => o.status === 'preparing').length,
      ready: data.orders.filter((o) => o.status === 'ready').length,
      'waiting-driver': data.orders.filter((o) => o.status === 'waiting-driver')
        .length,
      completed: data.orders.filter((o) => o.status === 'completed').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredOrders().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedOrders = computed<DailyOrderItem[]>(() => {
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
      this.data.set(structuredClone(DAILY_ORDERS_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: DailyOrderFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setShift(shift: DailyShift): void {
    this.shift.set(shift);
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

  reset(): void {
    this.clearTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.shift.set('all');
    this.search.set('');
    this.currentPage.set(1);
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
