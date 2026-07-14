import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { RestaurantCapacityData } from '../models/capacity.model';
import { CAPACITY_MOCK } from './capacity.mock';

@Injectable({ providedIn: 'root' })
export class CapacityFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantCapacityData | null>(null);
  readonly draftLimit = signal('');
  readonly saving = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private baselineLimit = 0;

  readonly parsedDraft = computed(() => this.parseLimit(this.draftLimit()));

  readonly isDirty = computed(() => {
    const draft = this.parsedDraft();
    if (draft === null) return this.draftLimit().trim().length > 0;
    return draft !== this.baselineLimit;
  });

  readonly confirmedToday = computed(() => this.data()?.confirmedToday ?? 0);

  readonly effectiveLimit = computed(() => {
    const draft = this.parsedDraft();
    if (draft !== null) return draft;
    return this.data()?.dailyLimit ?? 0;
  });

  readonly remaining = computed(() =>
    Math.max(0, this.effectiveLimit() - this.confirmedToday()),
  );

  readonly fillPercent = computed(() => {
    const limit = this.effectiveLimit();
    if (limit <= 0) return 0;
    return Math.min(100, Math.round((this.confirmedToday() / limit) * 100));
  });

  readonly isBusyToday = computed(
    () => this.confirmedToday() >= this.effectiveLimit() && this.effectiveLimit() > 0,
  );

  readonly isNearLimit = computed(() => {
    const data = this.data();
    if (!data || this.isBusyToday()) return false;
    const limit = this.effectiveLimit();
    if (limit <= 0) return false;
    return this.confirmedToday() / limit >= data.nearLimitThreshold;
  });

  readonly draftBelowConfirmed = computed(() => {
    const draft = this.parsedDraft();
    if (draft === null) return false;
    return draft < this.confirmedToday();
  });

  readonly week = computed(() => {
    const data = this.data();
    if (!data) return [];
    const draft = this.parsedDraft();
    const previewLimit = draft ?? data.dailyLimit;
    return data.week.map((day) => {
      const limit = day.isToday ? previewLimit : day.limit;
      return {
        ...day,
        limit,
        busy: day.confirmed >= limit && limit > 0,
      };
    });
  });

  load(): void {
    this.clearLoadTimer();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(CAPACITY_MOCK);
      this.applyData(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  setDraft(raw: string): void {
    this.draftLimit.set(raw);
  }

  save(): void {
    const data = this.data();
    const draft = this.parsedDraft();
    if (!data || draft === null || draft < 1 || this.saving()) return;

    this.saving.set(true);
    this.clearSaveTimer();

    this.saveTimer = setTimeout(() => {
      const next: RestaurantCapacityData = {
        ...data,
        dailyLimit: draft,
        week: data.week.map((day) => ({
          ...day,
          limit: draft,
          busy: day.confirmed >= draft,
        })),
        updatedAtLabel: {
          ar: 'تم الحفظ للتو',
          en: 'Saved just now',
        },
      };
      this.applyData(next);
      this.saving.set(false);
      this.saveTimer = null;
    }, 480);
  }

  resetDraft(): void {
    this.draftLimit.set(String(this.baselineLimit));
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearSaveTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.draftLimit.set('');
    this.saving.set(false);
    this.baselineLimit = 0;
  }

  private applyData(data: RestaurantCapacityData): void {
    this.data.set(data);
    this.baselineLimit = data.dailyLimit;
    this.draftLimit.set(String(data.dailyLimit));
  }

  private parseLimit(raw: string): number | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const value = Number(trimmed);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      return null;
    }
    return value;
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearSaveTimer(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }
}
