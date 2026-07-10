import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { RestaurantOverviewData } from '../models/restaurant-overview.model';
import { RESTAURANT_OVERVIEW_MOCK } from './restaurant-overview.mock';

export interface RestaurantOverviewFacadeState {
  page: PageStateModel;
  data: RestaurantOverviewData | null;
}

const initialState: RestaurantOverviewFacadeState = {
  page: { viewState: 'idle' },
  data: null,
};

@Injectable({ providedIn: 'root' })
export class RestaurantOverviewFacade {
  readonly page = signal<PageStateModel>(initialState.page);
  readonly data = signal<RestaurantOverviewData | null>(initialState.data);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearTimer();
    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      this.data.set(structuredClone(RESTAURANT_OVERVIEW_MOCK));
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
