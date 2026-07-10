import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { OrderDetailData } from '../models/order-detail.model';
import {
  ORDER_DETAIL_MOCKS,
  buildFallbackOrderDetail,
} from './order-detail.mock';

@Injectable({ providedIn: 'root' })
export class OrderDetailFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<OrderDetailData | null>(null);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private currentCode: string | null = null;

  load(orderCode: string): void {
    this.clearTimer();
    this.currentCode = orderCode;
    this.page.set({ viewState: 'loading' });
    this.data.set(null);

    this.loadTimer = setTimeout(() => {
      if (this.currentCode !== orderCode) return;

      const key = orderCode.trim().toUpperCase();
      if (!key) {
        this.page.set({
          viewState: 'empty',
          errorMessage: 'Order not found',
        });
        this.loadTimer = null;
        return;
      }

      const detail =
        ORDER_DETAIL_MOCKS[key] ?? buildFallbackOrderDetail(key);

      this.data.set(structuredClone(detail));
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 850);
  }

  retry(): void {
    if (this.currentCode) {
      this.load(this.currentCode);
    }
  }

  reset(): void {
    this.clearTimer();
    this.currentCode = null;
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
