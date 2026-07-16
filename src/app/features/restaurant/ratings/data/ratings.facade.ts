import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  RatingFilter,
  RestaurantRating,
  RestaurantRatingsData,
} from '../models/rating.model';
import { RATINGS_MOCK } from './ratings.mock';

export const RATINGS_PAGE_SIZE = 8;

function matchesFilter(stars: number, filter: RatingFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'five':
      return stars === 5;
    case 'four':
      return stars === 4;
    case 'three':
      return stars === 3;
    case 'low':
      return stars <= 2;
  }
}

@Injectable({ providedIn: 'root' })
export class RatingsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantRatingsData | null>(null);
  readonly filter = signal<RatingFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = RATINGS_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredRatings = computed<RestaurantRating[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.ratings.filter((rating) => {
      if (!matchesFilter(rating.stars, filter)) return false;
      if (!query) return true;

      const haystack = [
        rating.mealName.ar,
        rating.mealName.en,
        rating.comment.ar,
        rating.comment.en,
        rating.orderRef,
        rating.programLabel.ar,
        rating.programLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<RatingFilter, number>>(() => {
    const data = this.data();
    const empty: Record<RatingFilter, number> = {
      all: 0,
      five: 0,
      four: 0,
      three: 0,
      low: 0,
    };
    if (!data) return empty;

    return {
      all: data.ratings.length,
      five: data.ratings.filter((r) => r.stars === 5).length,
      four: data.ratings.filter((r) => r.stars === 4).length,
      three: data.ratings.filter((r) => r.stars === 3).length,
      low: data.ratings.filter((r) => r.stars <= 2).length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredRatings().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedRatings = computed(() => {
    const items = this.filteredRatings();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredRatings().length;
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
      this.data.set(structuredClone(RATINGS_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  setFilter(filter: RatingFilter): void {
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

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.search.set('');
    this.currentPage.set(1);
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
