import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  IngredientCatalogData,
  IngredientCategoryFilter,
  IngredientFilter,
  IngredientItem,
  IngredientStatus,
} from '../models/ingredient.model';
import { INGREDIENTS_MOCK } from './ingredients.mock';

export const INGREDIENTS_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class IngredientsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<IngredientCatalogData | null>(null);
  readonly filter = signal<IngredientFilter>('all');
  readonly category = signal<IngredientCategoryFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly togglingId = signal<string | null>(null);
  readonly pageSize = INGREDIENTS_PAGE_SIZE;

  readonly filteredIngredients = computed<IngredientItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const category = this.category();
    const query = this.search().trim().toLowerCase();

    return data.ingredients.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (!query) return true;

      const haystack = [
        item.name.ar,
        item.name.en,
        item.categoryLabel.ar,
        item.categoryLabel.en,
        ...item.allergenLabels.flatMap((label) => [label.ar, label.en]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<IngredientFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, active: 0, draft: 0, paused: 0 };
    if (!data) return empty;

    const category = this.category();
    const scoped = data.ingredients.filter(
      (item) => category === 'all' || item.category === category,
    );

    return {
      all: scoped.length,
      active: scoped.filter((item) => item.status === 'active').length,
      draft: scoped.filter((item) => item.status === 'draft').length,
      paused: scoped.filter((item) => item.status === 'paused').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredIngredients().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedIngredients = computed<IngredientItem[]>(() => {
    const items = this.filteredIngredients();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredIngredients().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearLoadTimer();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(INGREDIENTS_MOCK);
      this.syncSummaries(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 750);
  }

  prependIngredient(item: IngredientItem): void {
    const current = this.data();

    if (!current) {
      const seed = structuredClone(INGREDIENTS_MOCK);
      this.syncSummaries({
        ...seed,
        ingredients: [item, ...seed.ingredients],
      });
      this.filter.set('draft');
      this.currentPage.set(1);
      this.page.set({ viewState: 'success' });
      return;
    }

    this.syncSummaries({
      ...current,
      ingredients: [item, ...current.ingredients],
    });
    this.filter.set('draft');
    this.currentPage.set(1);
  }

  setFilter(filter: IngredientFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setCategory(category: IngredientCategoryFilter): void {
    this.category.set(category);
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

  toggleAvailability(ingredientId: string): void {
    const data = this.data();
    if (!data || this.togglingId()) return;

    const target = data.ingredients.find((item) => item.id === ingredientId);
    if (!target || target.status === 'draft') return;

    this.togglingId.set(ingredientId);
    if (this.toggleTimer) clearTimeout(this.toggleTimer);

    this.toggleTimer = setTimeout(() => {
      const nextStatus: IngredientStatus =
        target.status === 'active' ? 'paused' : 'active';

      const current = this.data();
      if (!current) {
        this.togglingId.set(null);
        this.toggleTimer = null;
        return;
      }

      this.syncSummaries({
        ...current,
        ingredients: current.ingredients.map((item) =>
          item.id === ingredientId
            ? {
                ...item,
                status: nextStatus,
                updatedAtLabel: {
                  ar: nextStatus === 'active' ? 'فُعِّل الآن' : 'أُوقف الآن',
                  en:
                    nextStatus === 'active'
                      ? 'Activated just now'
                      : 'Paused just now',
                },
              }
            : item,
        ),
      });

      this.togglingId.set(null);
      this.toggleTimer = null;
    }, 400);
  }

  retry(): void {
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
    this.page.set({ viewState: 'idle' });
    // Keep catalog data so newly created ingredients survive list remounts.
    this.filter.set('all');
    this.category.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.togglingId.set(null);
  }

  private syncSummaries(data: IngredientCatalogData): void {
    const byId: Record<string, number> = {
      total: data.ingredients.length,
      active: data.ingredients.filter((item) => item.status === 'active')
        .length,
      allergens: data.ingredients.filter((item) => item.allergenKeys.length > 0)
        .length,
      used: data.ingredients.filter((item) => item.mealUsageCount > 0).length,
    };

    this.data.set({
      ...data,
      summaries: data.summaries.map((card) => ({
        ...card,
        value: byId[card.id] ?? card.value,
      })),
    });
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
