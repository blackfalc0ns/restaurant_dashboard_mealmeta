import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { RestaurantQualityOverviewData } from '../models/restaurant-quality-overview.model';
import { RESTAURANT_QUALITY_OVERVIEW_MOCK } from './restaurant-quality-overview.mock';

@Injectable({ providedIn: 'root' })
export class RestaurantQualityOverviewFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantQualityOverviewData | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearTimer();
    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      this.data.set(structuredClone(RESTAURANT_QUALITY_OVERVIEW_MOCK));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  retry(): void {
    this.load();
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
