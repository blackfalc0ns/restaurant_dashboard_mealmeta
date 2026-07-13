import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  MenuData,
  MenuFilter,
  MenuMealItem,
  MenuMealStatus,
  MenuProgramFilter,
  MenuSlotFilter,
} from '../models/menu.model';
import { MENU_MOCK } from './menu.mock';

export const MENU_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class MenuFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<MenuData | null>(null);
  readonly filter = signal<MenuFilter>('all');
  readonly slot = signal<MenuSlotFilter>('all');
  readonly program = signal<MenuProgramFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly togglingId = signal<string | null>(null);
  readonly pageSize = MENU_PAGE_SIZE;

  readonly filteredMeals = computed<MenuMealItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const slot = this.slot();
    const program = this.program();
    const query = this.search().trim().toLowerCase();

    return data.meals.filter((meal) => {
      if (filter !== 'all' && meal.status !== filter) return false;
      if (slot !== 'all' && meal.slot !== slot) return false;
      if (program !== 'all' && meal.programKey !== program) return false;
      if (!query) return true;

      const haystack = [
        meal.name.ar,
        meal.name.en,
        meal.description.ar,
        meal.description.en,
        meal.programLabel.ar,
        meal.programLabel.en,
        meal.slotLabel.ar,
        meal.slotLabel.en,
        ...meal.allergyFlags.flatMap((f) => [f.ar, f.en]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<MenuFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, active: 0, draft: 0, paused: 0 };
    if (!data) return empty;

    const slot = this.slot();
    const program = this.program();
    const scoped = data.meals.filter((meal) => {
      if (slot !== 'all' && meal.slot !== slot) return false;
      if (program !== 'all' && meal.programKey !== program) return false;
      return true;
    });

    return {
      all: scoped.length,
      active: scoped.filter((m) => m.status === 'active').length,
      draft: scoped.filter((m) => m.status === 'draft').length,
      paused: scoped.filter((m) => m.status === 'paused').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredMeals().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedMeals = computed<MenuMealItem[]>(() => {
    const meals = this.filteredMeals();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return meals.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredMeals().length;
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
    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = this.withRoutes(structuredClone(MENU_MOCK));
      this.data.set(mock);
      this.syncSummaries(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  prependMeal(meal: MenuMealItem): void {
    const current = this.data();
    const nextMeal: MenuMealItem = {
      ...meal,
      route: meal.route ?? `/restaurant/operations/menu/${meal.id}`,
    };

    if (!current) {
      const seed = this.withRoutes(structuredClone(MENU_MOCK));
      this.syncSummaries({
        ...seed,
        meals: [nextMeal, ...seed.meals],
      });
      this.filter.set('draft');
      this.currentPage.set(1);
      this.page.set({ viewState: 'success' });
      return;
    }

    this.syncSummaries({
      ...current,
      meals: [nextMeal, ...current.meals],
    });
    this.filter.set('draft');
    this.currentPage.set(1);
  }

  applyMealPrices(updates: Record<string, number | null>): void {
    const current = this.data();
    if (!current) {
      const seed = this.withRoutes(structuredClone(MENU_MOCK));
      this.syncSummaries({
        ...seed,
        meals: seed.meals.map((meal) =>
          updates[meal.id] === undefined
            ? meal
            : {
                ...meal,
                priceKd: updates[meal.id],
                status: meal.status === 'active' ? 'draft' : meal.status,
                updatedAtLabel: {
                  ar: 'سعر بانتظار الاعتماد',
                  en: 'Price awaiting approval',
                },
              },
        ),
      });
      this.page.set({ viewState: 'success' });
      return;
    }

    this.syncSummaries({
      ...current,
      meals: current.meals.map((meal) =>
        updates[meal.id] === undefined
          ? meal
          : {
              ...meal,
              priceKd: updates[meal.id],
              status: meal.status === 'active' ? 'draft' : meal.status,
              updatedAtLabel: {
                ar: 'سعر بانتظار الاعتماد',
                en: 'Price awaiting approval',
              },
            },
      ),
    });
  }

  ensureLoaded(): void {
    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }
    const mock = this.withRoutes(structuredClone(MENU_MOCK));
    this.syncSummaries(mock);
    this.page.set({ viewState: 'success' });
  }

  setFilter(filter: MenuFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setSlot(slot: MenuSlotFilter): void {
    this.slot.set(slot);
    this.currentPage.set(1);
  }

  setProgram(program: MenuProgramFilter): void {
    this.program.set(program);
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

  toggleAvailability(mealId: string): void {
    const data = this.data();
    if (!data || this.togglingId()) return;

    const target = data.meals.find((meal) => meal.id === mealId);
    if (!target || target.status === 'draft') return;

    this.togglingId.set(mealId);
    if (this.toggleTimer) clearTimeout(this.toggleTimer);

    this.toggleTimer = setTimeout(() => {
      const nextStatus: MenuMealStatus =
        target.status === 'active' ? 'paused' : 'active';

      const current = this.data();
      if (!current) {
        this.togglingId.set(null);
        this.toggleTimer = null;
        return;
      }

      this.syncSummaries({
        ...current,
        meals: current.meals.map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                status: nextStatus,
                updatedAtLabel: {
                  ar: nextStatus === 'active' ? 'فُعِّل الآن' : 'أُوقف الآن',
                  en:
                    nextStatus === 'active'
                      ? 'Activated just now'
                      : 'Paused just now',
                },
              }
            : meal,
        ),
      });

      this.togglingId.set(null);
      this.toggleTimer = null;
    }, 450);
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
    this.data.set(null);
    this.filter.set('all');
    this.slot.set('all');
    this.program.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.togglingId.set(null);
  }

  private withRoutes(data: MenuData): MenuData {
    return {
      ...data,
      meals: data.meals.map((meal) => ({
        ...meal,
        route: meal.route ?? `/restaurant/operations/menu/${meal.id}`,
      })),
    };
  }

  private syncSummaries(data: MenuData): void {
    const byId: Record<string, number> = {
      total: data.meals.length,
      active: data.meals.filter((m) => m.status === 'active').length,
      draft: data.meals.filter((m) => m.status === 'draft').length,
      allergens: data.meals.filter((m) => m.allergyFlags.length > 0).length,
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
