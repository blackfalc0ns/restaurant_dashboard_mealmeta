import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  Upcoming24hData,
  Upcoming24hFilter,
  Upcoming24hItem,
  Upcoming24hShift,
} from '../models/upcoming-24h.model';
import { UPCOMING_24H_MOCK } from './upcoming-24h.mock';

export const UPCOMING_24H_PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class Upcoming24hFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<Upcoming24hData | null>(null);
  readonly filter = signal<Upcoming24hFilter>('all');
  readonly shift = signal<Upcoming24hShift>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = UPCOMING_24H_PAGE_SIZE;

  readonly filteredOrders = computed<Upcoming24hItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const shift = this.shift();
    const query = this.search().trim().toLowerCase();

    return data.orders.filter((order) => {
      if (filter !== 'all' && order.prepStatus !== filter) return false;
      if (shift !== 'all' && order.shift !== shift) return false;
      if (!query) return true;

      const haystack = [
        order.orderCode,
        order.batchCode,
        order.customerMaskedId,
        order.mealSummary.ar,
        order.mealSummary.en,
        order.programLabel.ar,
        order.programLabel.en,
        order.bundleLabel.ar,
        order.bundleLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<Upcoming24hFilter, number>>(() => {
    const data = this.data();
    const empty = {
      all: 0,
      'needs-docs': 0,
      preparing: 0,
      'docs-ready': 0,
      ready: 0,
    };
    if (!data) return empty;

    return {
      all: data.orders.length,
      'needs-docs': data.orders.filter((o) => o.prepStatus === 'needs-docs')
        .length,
      preparing: data.orders.filter((o) => o.prepStatus === 'preparing').length,
      'docs-ready': data.orders.filter((o) => o.prepStatus === 'docs-ready')
        .length,
      ready: data.orders.filter((o) => o.prepStatus === 'ready').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredOrders().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedOrders = computed<Upcoming24hItem[]>(() => {
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
      const mock = structuredClone(UPCOMING_24H_MOCK);
      this.data.set(mock);
      this.syncSummaries(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: Upcoming24hFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setShift(shift: Upcoming24hShift): void {
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

  private syncSummaries(data: Upcoming24hData): void {
    const byId: Record<string, number> = {
      total: data.orders.length,
      invoices: data.orders.filter((o) => o.invoiceGenerated).length,
      barcodes: data.orders.filter((o) => o.barcodeGenerated).length,
      labels: data.orders.filter((o) => o.labelsGenerated).length,
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
