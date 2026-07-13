import { Injectable, computed, inject, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { MenuFacade } from '../../menu/data/menu.facade';
import { MenuMealItem } from '../../menu/models/menu.model';
import {
  PricingBundleFilter,
  PricingFilter,
  PricingProgramFilter,
  PricingRow,
  PricingScope,
  PricingSummary,
  RestaurantPricingData,
} from '../models/pricing.model';
import { derivePricingFields, PRICING_MOCK } from './pricing.mock';

export const PRICING_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class PricingFacade {
  private readonly menuFacade = inject(MenuFacade);

  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantPricingData | null>(null);
  readonly scope = signal<PricingScope>('boxes');
  readonly filter = signal<PricingFilter>('all');
  readonly program = signal<PricingProgramFilter>('all');
  readonly bundle = signal<PricingBundleFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly drafts = signal<Record<string, string>>({});
  readonly mealDrafts = signal<Record<string, string>>({});
  readonly saving = signal(false);
  readonly pageSize = PRICING_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private baseline: Record<string, number | null> = {};
  private mealBaseline: Record<string, number | null> = {};

  readonly dirtyCount = computed(() => {
    if (this.scope() === 'meals') {
      const drafts = this.mealDrafts();
      let count = 0;
      for (const [id, raw] of Object.entries(drafts)) {
        if (this.parsePrice(raw) !== this.mealBaseline[id]) count += 1;
      }
      return count;
    }

    const data = this.data();
    if (!data) return 0;
    const drafts = this.drafts();
    let count = 0;
    for (const row of data.rows) {
      const raw = drafts[row.id];
      if (raw === undefined) continue;
      if (this.parsePrice(raw) !== this.baseline[row.id]) count += 1;
    }
    return count;
  });

  readonly isDirty = computed(() => this.dirtyCount() > 0);

  readonly mealSummaries = computed<PricingSummary[]>(() => {
    const meals = this.menuFacade.data()?.meals ?? [];
    const priced = meals.filter(
      (meal) => meal.priceKd !== null && meal.priceKd > 0,
    ).length;
    const missing = meals.length - priced;
    const pending = meals.filter((meal) => meal.status === 'draft').length;

    return [
      {
        id: 'total',
        label: { ar: 'الوجبات', en: 'Meals' },
        value: meals.length,
        hint: { ar: 'في القائمة', en: 'In menu' },
        tone: 'neutral',
        icon: 'lucideUtensilsCrossed',
      },
      {
        id: 'configured',
        label: { ar: 'مسعّرة', en: 'Priced' },
        value: priced,
        hint: { ar: 'لها سعر وجبة', en: 'Have a meal price' },
        tone: 'primary',
        icon: 'lucideCheck',
      },
      {
        id: 'missing',
        label: { ar: 'بدون سعر', en: 'Unpriced' },
        value: missing,
        hint: { ar: 'تحتاج تسعير', en: 'Need pricing' },
        tone: 'warning',
        icon: 'lucideTriangleAlert',
      },
      {
        id: 'pending',
        label: { ar: 'بانتظار الاعتماد', en: 'Pending approval' },
        value: pending,
        hint: { ar: 'تعديل السعر يحتاج موافقة', en: 'Price edits need approval' },
        tone: 'accent',
        icon: 'lucideFilePen',
      },
    ];
  });

  readonly filteredRows = computed<PricingRow[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const program = this.program();
    const bundle = this.bundle();
    const query = this.search().trim().toLowerCase();

    return data.rows.filter((row) => {
      if (filter !== 'all' && row.status !== filter) return false;
      if (program !== 'all' && row.programId !== program) return false;
      if (bundle !== 'all' && row.bundleId !== bundle) return false;
      if (!query) return true;

      const haystack = [
        row.programLabel.ar,
        row.programLabel.en,
        row.bundleLabel.ar,
        row.bundleLabel.en,
        row.id,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filteredMeals = computed<MenuMealItem[]>(() => {
    const meals = this.menuFacade.data()?.meals ?? [];
    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return meals.filter((meal) => {
      const priced = meal.priceKd !== null && meal.priceKd > 0;
      if (filter === 'configured' && !priced) return false;
      if (filter === 'missing' && priced) return false;
      if (!query) return true;

      const haystack = [
        meal.name.ar,
        meal.name.en,
        meal.slotLabel.ar,
        meal.slotLabel.en,
        meal.programLabel.ar,
        meal.programLabel.en,
        meal.bundleLabel.ar,
        meal.bundleLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<PricingFilter, number>>(() => {
    if (this.scope() === 'meals') {
      const meals = this.menuFacade.data()?.meals ?? [];
      const priced = meals.filter(
        (meal) => meal.priceKd !== null && meal.priceKd > 0,
      ).length;
      return {
        all: meals.length,
        configured: priced,
        missing: meals.length - priced,
      };
    }

    const data = this.data();
    const empty = { all: 0, configured: 0, missing: 0 };
    if (!data) return empty;

    const program = this.program();
    const bundle = this.bundle();
    const scoped = data.rows.filter(
      (row) =>
        (program === 'all' || row.programId === program) &&
        (bundle === 'all' || row.bundleId === bundle),
    );

    return {
      all: scoped.length,
      configured: scoped.filter((row) => row.status === 'configured').length,
      missing: scoped.filter((row) => row.status === 'missing').length,
    };
  });

  readonly programs = computed(() => {
    const data = this.data();
    if (!data) return [];
    const map = new Map<string, PricingRow['programLabel']>();
    for (const row of data.rows) {
      if (!map.has(row.programId)) map.set(row.programId, row.programLabel);
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  });

  readonly bundles = computed(() => {
    const data = this.data();
    if (!data) return [];
    const map = new Map<string, PricingRow['bundleLabel']>();
    for (const row of data.rows) {
      if (!map.has(row.bundleId)) map.set(row.bundleId, row.bundleLabel);
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  });

  readonly totalPages = computed(() => {
    const total =
      this.scope() === 'meals'
        ? this.filteredMeals().length
        : this.filteredRows().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedRows = computed<PricingRow[]>(() => {
    const rows = this.filteredRows();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
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
    const total =
      this.scope() === 'meals'
        ? this.filteredMeals().length
        : this.filteredRows().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  load(): void {
    this.clearLoadTimer();
    this.menuFacade.ensureLoaded();
    this.syncMealBaseline();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(PRICING_MOCK);
      this.applyData(mock);
      this.syncMealBaseline();
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 750);
  }

  setScope(scope: PricingScope): void {
    if (this.scope() === scope) return;
    this.scope.set(scope);
    this.filter.set('all');
    this.search.set('');
    this.program.set('all');
    this.bundle.set('all');
    this.currentPage.set(1);
    if (scope === 'meals') {
      this.menuFacade.ensureLoaded();
      this.syncMealBaseline();
    }
  }

  setFilter(filter: PricingFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setProgram(program: PricingProgramFilter): void {
    this.program.set(program);
    this.currentPage.set(1);
  }

  setBundle(bundle: PricingBundleFilter): void {
    this.bundle.set(bundle);
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

  draftValue(rowId: string): string {
    const drafts = this.drafts();
    if (drafts[rowId] !== undefined) return drafts[rowId];
    const row = this.data()?.rows.find((item) => item.id === rowId);
    return row?.price26DaysKd === null || row?.price26DaysKd === undefined
      ? ''
      : String(row.price26DaysKd);
  }

  mealDraftValue(mealId: string): string {
    const drafts = this.mealDrafts();
    if (drafts[mealId] !== undefined) return drafts[mealId];
    const meal = this.menuFacade.data()?.meals.find((item) => item.id === mealId);
    return meal?.priceKd === null || meal?.priceKd === undefined
      ? ''
      : String(meal.priceKd);
  }

  isRowDirty(rowId: string): boolean {
    const raw = this.drafts()[rowId];
    if (raw === undefined) return false;
    return this.parsePrice(raw) !== this.baseline[rowId];
  }

  isMealDirty(mealId: string): boolean {
    const raw = this.mealDrafts()[mealId];
    if (raw === undefined) return false;
    return this.parsePrice(raw) !== this.mealBaseline[mealId];
  }

  previewRow(row: PricingRow): PricingRow {
    const raw = this.drafts()[row.id];
    if (raw === undefined) return row;
    const parsed = this.parsePrice(raw);
    return {
      ...row,
      ...derivePricingFields(parsed, row.settlementCommissionPct),
    };
  }

  onPriceInput(rowId: string, value: string): void {
    this.drafts.update((current) => ({ ...current, [rowId]: value }));
  }

  onMealPriceInput(mealId: string, value: string): void {
    this.mealDrafts.update((current) => ({ ...current, [mealId]: value }));
  }

  discardChanges(): void {
    if (this.scope() === 'meals') {
      this.mealDrafts.set({});
      return;
    }
    this.drafts.set({});
  }

  saveChanges(): void {
    if (!this.isDirty() || this.saving()) return;

    if (this.scope() === 'meals') {
      this.saveMealChanges();
      return;
    }

    const data = this.data();
    if (!data) return;

    this.saving.set(true);
    if (this.saveTimer) clearTimeout(this.saveTimer);

    this.saveTimer = setTimeout(() => {
      const drafts = this.drafts();
      const nextRows = data.rows.map((row) => {
        const raw = drafts[row.id];
        if (raw === undefined) return row;
        const parsed = this.parsePrice(raw);
        return {
          ...row,
          ...derivePricingFields(parsed, row.settlementCommissionPct),
          updatedAtLabel: {
            ar: 'حُفظ الآن',
            en: 'Saved just now',
          },
        };
      });

      this.applyData({ ...data, rows: nextRows });
      this.drafts.set({});
      this.saving.set(false);
      this.saveTimer = null;
    }, 650);
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.page.set({ viewState: 'idle' });
    this.scope.set('boxes');
    this.filter.set('all');
    this.program.set('all');
    this.bundle.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.drafts.set({});
    this.mealDrafts.set({});
    this.saving.set(false);
  }

  private saveMealChanges(): void {
    this.saving.set(true);
    if (this.saveTimer) clearTimeout(this.saveTimer);

    this.saveTimer = setTimeout(() => {
      const drafts = this.mealDrafts();
      const updates: Record<string, number | null> = {};
      for (const [id, raw] of Object.entries(drafts)) {
        const parsed = this.parsePrice(raw);
        if (parsed !== this.mealBaseline[id]) {
          updates[id] = parsed;
        }
      }

      this.menuFacade.applyMealPrices(updates);
      this.mealDrafts.set({});
      this.syncMealBaseline();
      this.saving.set(false);
      this.saveTimer = null;
    }, 650);
  }

  private syncMealBaseline(): void {
    const meals = this.menuFacade.data()?.meals ?? [];
    this.mealBaseline = Object.fromEntries(
      meals.map((meal) => [meal.id, meal.priceKd]),
    );
  }

  private applyData(data: RestaurantPricingData): void {
    const byId: Record<string, number | string> = {
      total: data.rows.length,
      configured: data.rows.filter((row) => row.status === 'configured').length,
      missing: data.rows.filter((row) => row.status === 'missing').length,
      commission: `${data.settlementCommissionPct}%`,
    };

    this.baseline = Object.fromEntries(
      data.rows.map((row) => [row.id, row.price26DaysKd]),
    );

    this.data.set({
      ...data,
      summaries: data.summaries.map((card) => ({
        ...card,
        value: byId[card.id] ?? card.value,
      })),
    });
  }

  private parsePrice(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return Math.round(parsed * 1000) / 1000;
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
