import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { RestaurantOperationsData } from '../models/restaurant-operations.model';
import { RESTAURANT_OPERATIONS_MOCK } from './restaurant-operations.mock';

@Injectable({ providedIn: 'root' })
export class RestaurantOperationsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantOperationsData | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearTimer();
    this.page.set({ viewState: 'loading' });

    this.loadTimer = setTimeout(() => {
      this.data.set(structuredClone(RESTAURANT_OPERATIONS_MOCK));
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
