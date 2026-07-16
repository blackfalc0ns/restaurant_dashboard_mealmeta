import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  BusyKind,
  CapacityDaySnapshot,
  RestaurantCapacityData,
} from '../models/capacity.model';
import { CAPACITY_MOCK } from './capacity.mock';

function resolveBusy(
  confirmed: number,
  limit: number,
  manualBusy: boolean,
): { busy: boolean; busyKind: BusyKind } {
  if (manualBusy) return { busy: true, busyKind: 'manual' };
  if (limit > 0 && confirmed >= limit) return { busy: true, busyKind: 'capacity' };
  return { busy: false, busyKind: 'none' };
}

function withDayState(
  day: CapacityDaySnapshot,
  limit: number,
): CapacityDaySnapshot {
  const { busy, busyKind } = resolveBusy(day.confirmed, limit, day.manualBusy);
  return { ...day, limit, busy, busyKind };
}

@Injectable({ providedIn: 'root' })
export class CapacityFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantCapacityData | null>(null);
  readonly draftLimit = signal('');
  readonly saving = signal(false);
  readonly togglingDate = signal<string | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;
  private baselineLimit = 0;

  readonly parsedDraft = computed(() => this.parseLimit(this.draftLimit()));

  readonly isDirty = computed(() => {
    const draft = this.parsedDraft();
    if (draft === null) return this.draftLimit().trim().length > 0;
    return draft !== this.baselineLimit;
  });

  readonly confirmedToday = computed(() => this.data()?.confirmedToday ?? 0);

  readonly currentLimit = computed(() => this.data()?.dailyLimit ?? 0);

  readonly draftBelowCurrent = computed(() => {
    const draft = this.parsedDraft();
    return draft !== null && draft < this.currentLimit();
  });

  readonly effectiveLimit = computed(() => {
    const draft = this.parsedDraft();
    const current = this.currentLimit();
    if (draft !== null && draft >= current) return draft;
    return current;
  });

  readonly remaining = computed(() =>
    Math.max(0, this.effectiveLimit() - this.confirmedToday()),
  );

  readonly fillPercent = computed(() => {
    const limit = this.effectiveLimit();
    if (limit <= 0) return 0;
    return Math.min(100, Math.round((this.confirmedToday() / limit) * 100));
  });

  readonly isAtCapacityToday = computed(
    () => this.confirmedToday() >= this.effectiveLimit() && this.effectiveLimit() > 0,
  );

  readonly isNearLimit = computed(() => {
    const data = this.data();
    if (!data || this.isAtCapacityToday()) return false;
    const limit = this.effectiveLimit();
    if (limit <= 0) return false;
    return this.confirmedToday() / limit >= data.nearLimitThreshold;
  });

  readonly days = computed(() => {
    const data = this.data();
    if (!data) return [];
    const previewLimit = this.effectiveLimit();
    return data.days.map((day) =>
      withDayState(day, day.isToday ? previewLimit : day.limit),
    );
  });

  readonly upcomingDays = computed(() =>
    this.days().filter((day) => !day.isPast),
  );

  readonly today = computed(
    () => this.days().find((day) => day.isToday) ?? null,
  );

  readonly manualBusyCount = computed(
    () => this.upcomingDays().filter((day) => day.manualBusy).length,
  );

  load(): void {
    this.clearLoadTimer();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      this.applyData(structuredClone(CAPACITY_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  setDraft(raw: string): void {
    this.draftLimit.set(raw);
  }

  increaseDraft(amount: number): void {
    const draft = this.parsedDraft();
    const base =
      draft !== null && draft >= this.currentLimit()
        ? draft
        : this.currentLimit();
    this.draftLimit.set(String(base + amount));
  }

  save(): void {
    const data = this.data();
    const draft = this.parsedDraft();
    if (
      !data ||
      draft === null ||
      draft <= this.baselineLimit ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(true);
    this.clearSaveTimer();

    this.saveTimer = setTimeout(() => {
      const next: RestaurantCapacityData = {
        ...data,
        dailyLimit: draft,
        days: data.days.map((day) => withDayState({ ...day, limit: draft }, draft)),
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

  setManualBusy(dateIso: string): void {
    this.toggleBusy(dateIso, true);
  }

  clearManualBusy(dateIso: string): void {
    this.toggleBusy(dateIso, false);
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearSaveTimer();
    this.clearToggleTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.draftLimit.set('');
    this.saving.set(false);
    this.togglingDate.set(null);
    this.baselineLimit = 0;
  }

  private toggleBusy(dateIso: string, manualBusy: boolean): void {
    const data = this.data();
    if (!data || this.togglingDate()) return;

    const target = data.days.find((day) => day.dateIso === dateIso);
    if (!target?.canToggleManual) return;
    if (target.manualBusy === manualBusy) return;

    const atCapacity = target.confirmed >= target.limit && target.limit > 0;
    if (!manualBusy && atCapacity) return;

    this.togglingDate.set(dateIso);
    this.clearToggleTimer();

    this.toggleTimer = setTimeout(() => {
      const current = this.data();
      if (!current) return;

      this.data.set({
        ...current,
        days: current.days.map((day) => {
          if (day.dateIso !== dateIso) return day;
          return withDayState({ ...day, manualBusy }, day.limit);
        }),
        updatedAtLabel: {
          ar: 'تم التحديث للتو',
          en: 'Updated just now',
        },
      });
      this.togglingDate.set(null);
      this.toggleTimer = null;
    }, 420);
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

  private clearToggleTimer(): void {
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
  }
}
