import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  PendingConfirmationData,
  PendingConfirmationFilter,
  PendingConfirmationItem,
} from '../models/pending-confirmation.model';
import { PENDING_CONFIRMATION_MOCK } from './pending-confirmation.mock';

export const PENDING_CONFIRMATION_PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class PendingConfirmationFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<PendingConfirmationData | null>(null);
  readonly filter = signal<PendingConfirmationFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly confirmingId = signal<string | null>(null);
  readonly pageSize = PENDING_CONFIRMATION_PAGE_SIZE;

  readonly filteredOrders = computed<PendingConfirmationItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.orders.filter((order) => {
      if (filter === 'confirmed') {
        if (!order.confirmed) return false;
      } else if (filter !== 'all') {
        if (order.confirmed || order.urgency !== filter) return false;
      }

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

  readonly filterCounts = computed<
    Record<PendingConfirmationFilter, number>
  >(() => {
    const data = this.data();
    const empty = {
      all: 0,
      critical: 0,
      warning: 0,
      normal: 0,
      overdue: 0,
      confirmed: 0,
    };
    if (!data) return empty;

    const open = data.orders.filter((o) => !o.confirmed);
    return {
      all: open.length,
      critical: open.filter((o) => o.urgency === 'critical').length,
      warning: open.filter((o) => o.urgency === 'warning').length,
      normal: open.filter((o) => o.urgency === 'normal').length,
      overdue: open.filter((o) => o.urgency === 'overdue').length,
      confirmed: data.orders.filter((o) => o.confirmed).length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredOrders().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedOrders = computed<PendingConfirmationItem[]>(() => {
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
  private confirmTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearLoadTimer();
    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      this.data.set(structuredClone(PENDING_CONFIRMATION_MOCK));
      this.syncSummaries();
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: PendingConfirmationFilter): void {
    this.filter.set(filter);
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

  confirmOrder(orderId: string): void {
    const data = this.data();
    if (!data || this.confirmingId()) return;

    const target = data.orders.find((order) => order.id === orderId);
    if (!target || target.confirmed) return;

    this.confirmingId.set(orderId);
    this.clearConfirmTimer();

    this.confirmTimer = setTimeout(() => {
      this.data.update((current) => {
        if (!current) return current;
        return {
          ...current,
          orders: current.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  confirmed: true,
                  deadlineLabel: {
                    ar: 'تم التأكيد',
                    en: 'Confirmed',
                  },
                  hoursLeft: 0,
                }
              : order,
          ),
        };
      });
      this.syncSummaries();
      this.confirmingId.set(null);
      this.confirmTimer = null;
    }, 650);
  }

  retry(): void {
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearConfirmTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.confirmingId.set(null);
  }

  private syncSummaries(): void {
    this.data.update((current) => {
      if (!current) return current;
      const open = current.orders.filter((o) => !o.confirmed);
      const byId: Record<string, number> = {
        pending: open.length,
        critical: open.filter((o) => o.urgency === 'critical').length,
        warning: open.filter((o) => o.urgency === 'warning').length,
        overdue: open.filter((o) => o.urgency === 'overdue').length,
      };

      return {
        ...current,
        summaries: current.summaries.map((card) => ({
          ...card,
          value: byId[card.id] ?? card.value,
        })),
      };
    });
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearConfirmTimer(): void {
    if (this.confirmTimer) {
      clearTimeout(this.confirmTimer);
      this.confirmTimer = null;
    }
  }
}
