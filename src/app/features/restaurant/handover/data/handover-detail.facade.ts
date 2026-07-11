import { Injectable, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { HandoverDetailData } from '../models/handover.model';
import {
  buildFallbackHandoverDetail,
  HANDOVER_DETAIL_MOCKS,
} from './handover.mock';

@Injectable({ providedIn: 'root' })
export class HandoverDetailFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<HandoverDetailData | null>(null);
  readonly confirmingPickup = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private actionTimer: ReturnType<typeof setTimeout> | null = null;
  private lastOrderCode = '';

  load(orderCode: string): void {
    this.clearLoadTimer();
    this.lastOrderCode = orderCode;
    this.page.set({ viewState: 'loading' });
    this.data.set(null);

    this.loadTimer = setTimeout(() => {
      const key = orderCode.trim().toUpperCase();
      const mock = structuredClone(
        HANDOVER_DETAIL_MOCKS[key] ?? buildFallbackHandoverDetail(key || 'ORD-0000'),
      );
      this.data.set(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 700);
  }

  confirmPickup(): void {
    const data = this.data();
    if (!data || data.status !== 'awaiting-pickup' || this.confirmingPickup()) {
      return;
    }

    this.confirmingPickup.set(true);
    this.clearActionTimer();

    this.actionTimer = setTimeout(() => {
      this.data.update((current) => {
        if (!current) return current;
        return {
          ...current,
          status: 'en-route',
          pickupHint: {
            ar: 'تم تأكيد استلام المندوب · جاري التوصيل',
            en: 'Driver pickup confirmed · delivering',
          },
          etaLabel: { ar: 'خلال 30 د', en: 'In 30m' },
          pickedUpAtLabel: { ar: 'الآن', en: 'Just now' },
          boxes: current.boxes.map((box) => ({
            ...box,
            pickupScanned: true,
            pickupAtLabel: { ar: 'الآن', en: 'Just now' },
          })),
          checklist: current.checklist.map((item) =>
            item.id === 'c3'
              ? {
                  ...item,
                  done: true,
                  hint: {
                    ar: 'تم مسح كل البوكسات',
                    en: 'All boxes scanned',
                  },
                }
              : item,
          ),
          timeline: current.timeline.map((item) => {
            const isPickupStep =
              !item.done &&
              (item.title.en.toLowerCase().includes('pickup') ||
                item.title.ar.includes('استلام'));
            if (!isPickupStep) return item;
            return {
              ...item,
              done: true,
              tone: 'success' as const,
              time: { ar: 'الآن', en: 'Just now' },
              detail: {
                ar: 'تم مسح الاستلام من لوحة المطعم',
                en: 'Pickup scanned from restaurant panel',
              },
            };
          }),
        };
      });
      this.confirmingPickup.set(false);
      this.actionTimer = null;
    }, 650);
  }

  retry(): void {
    this.load(this.lastOrderCode);
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearActionTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.confirmingPickup.set(false);
    this.lastOrderCode = '';
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearActionTimer(): void {
    if (this.actionTimer) {
      clearTimeout(this.actionTimer);
      this.actionTimer = null;
    }
  }
}
