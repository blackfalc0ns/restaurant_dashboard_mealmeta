import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  FinancePeriod,
  RestaurantFinanceOverviewData,
} from '../models/restaurant-finance-overview.model';
import { RESTAURANT_FINANCE_OVERVIEW_MOCK } from './restaurant-finance-overview.mock';

@Injectable({ providedIn: 'root' })
export class RestaurantFinanceOverviewFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantFinanceOverviewData | null>(null);
  readonly period = signal<FinancePeriod>('month');

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(period: FinancePeriod = this.period()): void {
    this.clearTimer();
    this.period.set(period);
    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      const next = structuredClone(RESTAURANT_FINANCE_OVERVIEW_MOCK);
      next.period = period;
      this.data.set(next);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setPeriod(period: FinancePeriod): void {
    if (period === this.period() && this.page().viewState === 'success') {
      return;
    }
    this.load(period);
  }

  retry(): void {
    this.load(this.period());
  }

  reset(): void {
    this.clearTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
  }

  private clearTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
