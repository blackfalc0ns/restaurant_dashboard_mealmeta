import { Injectable, inject, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import { MenuDetailData } from '../models/menu-detail.model';
import { MenuMealStatus } from '../models/menu.model';
import {
  buildFallbackMenuDetail,
  buildMenuDetail,
  getMenuDetailById,
} from './menu-detail.mock';
import { MenuFacade } from './menu.facade';

@Injectable({ providedIn: 'root' })
export class MenuDetailFacade {
  private readonly menuFacade = inject(MenuFacade);

  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<MenuDetailData | null>(null);
  readonly toggling = signal(false);

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;
  private lastMealId = '';

  load(mealId: string): void {
    this.clearLoadTimer();
    this.lastMealId = mealId;
    this.page.set({ viewState: 'loading' });
    this.data.set(null);

    this.loadTimer = setTimeout(() => {
      const fromList = this.menuFacade.data()?.meals.find(
        (meal) => meal.id === mealId,
      );
      const detail = fromList
        ? buildMenuDetail(structuredClone(fromList))
        : getMenuDetailById(mealId) ??
          buildFallbackMenuDetail(mealId || 'mn-unknown');

      this.data.set(detail);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  toggleAvailability(): void {
    const data = this.data();
    if (!data || data.status === 'draft' || this.toggling()) return;

    this.toggling.set(true);
    this.menuFacade.toggleAvailability(data.id);

    if (this.toggleTimer) clearTimeout(this.toggleTimer);
    this.toggleTimer = setTimeout(() => {
      const nextStatus: MenuMealStatus =
        data.status === 'active' ? 'paused' : 'active';

      this.data.update((current) => {
        if (!current) return current;
        return {
          ...current,
          status: nextStatus,
          updatedAtLabel: {
            ar: nextStatus === 'active' ? 'فُعِّل الآن' : 'أُوقف الآن',
            en:
              nextStatus === 'active'
                ? 'Activated just now'
                : 'Paused just now',
          },
        };
      });

      this.toggling.set(false);
      this.toggleTimer = null;
    }, 450);
  }

  retry(): void {
    this.load(this.lastMealId);
  }

  reset(): void {
    this.clearLoadTimer();
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.toggling.set(false);
    this.lastMealId = '';
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}
