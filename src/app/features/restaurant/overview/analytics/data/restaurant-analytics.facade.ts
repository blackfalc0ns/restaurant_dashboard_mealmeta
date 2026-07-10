import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  AnalyticsPeriod,
  RestaurantAnalyticsData,
} from '../models/restaurant-analytics.model';
import { RESTAURANT_ANALYTICS_MOCK } from './restaurant-analytics.mock';

@Injectable({ providedIn: 'root' })
export class RestaurantAnalyticsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantAnalyticsData | null>(null);
  readonly period = signal<AnalyticsPeriod>('7d');

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(period: AnalyticsPeriod = this.period()): void {
    this.clearTimer();
    this.period.set(period);
    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      const next = structuredClone(RESTAURANT_ANALYTICS_MOCK);
      next.period = period;
      this.data.set(next);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setPeriod(period: AnalyticsPeriod): void {
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
