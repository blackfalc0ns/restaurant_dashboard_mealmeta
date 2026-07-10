import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  ActivityFilter,
  ActivityFeedItem,
  RestaurantActivityData,
} from '../models/restaurant-activity.model';
import { RESTAURANT_ACTIVITY_MOCK } from './restaurant-activity.mock';

export const ACTIVITY_PAGE_SIZE = 3;

@Injectable({ providedIn: 'root' })
export class RestaurantActivityFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantActivityData | null>(null);
  readonly filter = signal<ActivityFilter>('all');
  readonly currentPage = signal(1);
  readonly pageSize = ACTIVITY_PAGE_SIZE;

  readonly filteredFeed = computed<ActivityFeedItem[]>(() => {
    const data = this.data();
    if (!data) return [];
    const filter = this.filter();
    if (filter === 'all') return data.feed;
    if (filter === 'critical') {
      return data.feed.filter((item) => item.severity === 'critical');
    }
    return data.feed.filter((item) => item.category === filter);
  });

  readonly totalPages = computed(() => {
    const total = this.filteredFeed().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedFeed = computed<ActivityFeedItem[]>(() => {
    const feed = this.filteredFeed();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return feed.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredFeed().length;
    if (total === 0) {
      return { from: 0, to: 0, total: 0 };
    }
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  readonly filterCounts = computed<Record<ActivityFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, critical: 0, ops: 0, finance: 0, quality: 0 };
    if (!data) return empty;
    return {
      all: data.feed.length,
      critical: data.feed.filter((item) => item.severity === 'critical').length,
      ops: data.feed.filter((item) => item.category === 'ops').length,
      finance: data.feed.filter((item) => item.category === 'finance').length,
      quality: data.feed.filter((item) => item.category === 'quality').length,
    };
  });

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearTimer();
    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      this.data.set(structuredClone(RESTAURANT_ACTIVITY_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: ActivityFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    const next = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(next);
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
    this.currentPage.set(1);
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
