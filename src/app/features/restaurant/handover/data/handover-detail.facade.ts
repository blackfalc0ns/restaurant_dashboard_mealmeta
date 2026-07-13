import { Injectable, inject, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { ArchiveFacade } from '../../archive/data/archive.facade';
import { archiveItemFromHandoverDetail } from '../../archive/data/archive-mappers';
import { HandoverDetailData } from '../models/handover.model';
import {
  buildFallbackHandoverDetail,
  HANDOVER_DETAIL_MOCKS,
} from './handover.mock';
import { HandoverFacade } from './handover.facade';

@Injectable({ providedIn: 'root' })
export class HandoverDetailFacade {
  private readonly archiveFacade = inject(ArchiveFacade);
  private readonly handoverFacade = inject(HandoverFacade);

  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<HandoverDetailData | null>(null);
  readonly confirmingPickup = signal(false);
  readonly archiving = signal(false);
  readonly archived = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private actionTimer: ReturnType<typeof setTimeout> | null = null;
  private lastOrderCode = '';

  load(orderCode: string): void {
    this.clearLoadTimer();
    this.lastOrderCode = orderCode;
    this.page.set({ viewState: 'loading' });
    this.data.set(null);
    this.archived.set(false);

    this.loadTimer = setTimeout(() => {
      const key = orderCode.trim().toUpperCase();
      const mock = structuredClone(
        HANDOVER_DETAIL_MOCKS[key] ??
          buildFallbackHandoverDetail(key || 'ORD-0000'),
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

  confirmDelivery(): void {
    const data = this.data();
    if (!data || data.status !== 'en-route' || this.confirmingPickup()) return;

    this.confirmingPickup.set(true);
    this.clearActionTimer();

    this.actionTimer = setTimeout(() => {
      this.data.update((current) => {
        if (!current) return current;
        return {
          ...current,
          status: 'delivered',
          pickupHint: {
            ar: 'تم التسليم · جاهز للنقل إلى الأرشيف',
            en: 'Delivered · ready to move to archive',
          },
          etaLabel: { ar: 'تم التسليم', en: 'Delivered' },
          boxes: current.boxes.map((box) => ({
            ...box,
            deliveryScanned: true,
            deliveryAtLabel: { ar: 'الآن', en: 'Just now' },
          })),
          checklist: current.checklist.map((item) =>
            item.id === 'c4'
              ? {
                  ...item,
                  done: true,
                  hint: {
                    ar: 'اكتمل التسليم',
                    en: 'Delivery completed',
                  },
                }
              : item,
          ),
          timeline: current.timeline.map((item) => {
            const isDeliveryStep =
              !item.done &&
              (item.title.en.toLowerCase().includes('delivery') ||
                item.title.ar.includes('تسليم'));
            if (!isDeliveryStep) return item;
            return {
              ...item,
              done: true,
              tone: 'success' as const,
              time: { ar: 'الآن', en: 'Just now' },
              detail: {
                ar: 'تم مسح التسليم',
                en: 'Delivery scan completed',
              },
            };
          }),
        };
      });
      this.confirmingPickup.set(false);
      this.actionTimer = null;
    }, 650);
  }

  moveToArchive(onDone?: () => void): void {
    const data = this.data();
    if (
      !data ||
      this.archiving() ||
      this.archived() ||
      data.status === 'awaiting-pickup'
    ) {
      return;
    }

    this.archiving.set(true);
    this.clearActionTimer();

    this.actionTimer = setTimeout(() => {
      this.archiveFacade.prependOrder(archiveItemFromHandoverDetail(data));
      this.handoverFacade.removeOrderByCode(data.orderCode);

      this.data.update((current) =>
        current
          ? {
              ...current,
              status: 'delivered',
              pickupHint: {
                ar: 'تم نقل الطلب إلى الأرشيف',
                en: 'Order moved to archive',
              },
            }
          : current,
      );
      this.archived.set(true);
      this.archiving.set(false);
      this.actionTimer = null;
      onDone?.();
    }, 550);
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
    this.archiving.set(false);
    this.archived.set(false);
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
