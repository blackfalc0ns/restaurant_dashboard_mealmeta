import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  DeductionFilter,
  DeductionLine,
  RestaurantDeductionsData,
} from '../models/deductions.model';
import { DEDUCTIONS_MOCK } from './deductions.mock';

export const DEDUCTIONS_PAGE_SIZE = 4;

@Injectable({ providedIn: 'root' })
export class DeductionsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantDeductionsData | null>(null);
  readonly filter = signal<DeductionFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = DEDUCTIONS_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredLines = computed<DeductionLine[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.lines.filter((line) => {
      if (filter !== 'all' && line.status !== filter) return false;
      if (!query) return true;

      const haystack = [
        line.code,
        line.complaintCode ?? '',
        line.title.ar,
        line.title.en,
        line.detail.ar,
        line.detail.en,
        line.periodLabel.ar,
        line.periodLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<DeductionFilter, number>>(() => {
    const data = this.data();
    const empty = {
      all: 0,
      pending: 0,
      applied: 0,
      disputed: 0,
      reversed: 0,
    };
    if (!data) return empty;

    return {
      all: data.lines.length,
      pending: data.lines.filter((l) => l.status === 'pending').length,
      applied: data.lines.filter((l) => l.status === 'applied').length,
      disputed: data.lines.filter((l) => l.status === 'disputed').length,
      reversed: data.lines.filter((l) => l.status === 'reversed').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredLines().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedLines = computed(() => {
    const items = this.filteredLines();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredLines().length;
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
      this.data.set(structuredClone(DEDUCTIONS_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  setFilter(filter: DeductionFilter): void {
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

  lineById(id: string): DeductionLine | null {
    return this.data()?.lines.find((line) => line.id === id) ?? null;
  }

  ensureLoaded(): void {
    this.load();
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
