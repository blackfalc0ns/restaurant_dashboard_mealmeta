import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideGauge,
  lucideInfo,
  lucidePackage,
  lucideSave,
  lucideTriangleAlert,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsHeroComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { CapacityFacade } from './data/capacity.facade';
import { CapacitySkeletonComponent } from './capacity-skeleton.component';
import { CapacityDaySnapshot } from './models/capacity.model';

@Component({
  selector: 'mm-capacity-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    CapacitySkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
  ],
  templateUrl: './capacity.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-cp-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideGauge,
      lucideInfo,
      lucidePackage,
      lucideSave,
      lucideTriangleAlert,
    }),
  ],
})
export class CapacityPageComponent implements OnInit {
  readonly facade = inject(CapacityFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly dateLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.dateLabel, this.locale.locale()) : '';
  });

  readonly note = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.note, this.locale.locale()) : '';
  });

  readonly updatedAt = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.updatedAtLabel, this.locale.locale()) : '';
  });

  readonly remainingLabel = computed(() =>
    this.facade.isBusyToday()
      ? this.locale.isRtl()
        ? 'مكتمل'
        : 'Full'
      : String(this.facade.remaining()),
  );

  readonly statusLabel = computed(() =>
    this.facade.isBusyToday()
      ? this.locale.isRtl()
        ? 'Busy اليوم'
        : 'Busy today'
      : this.facade.isNearLimit()
        ? this.locale.isRtl()
          ? 'قرب الحد'
          : 'Near limit'
        : this.locale.isRtl()
          ? 'متاح'
          : 'Available',
  );

  readonly saveLabel = computed(() =>
    this.facade.saving()
      ? this.locale.isRtl()
        ? 'جاري الحفظ...'
        : 'Saving...'
      : this.locale.isRtl()
        ? 'حفظ الحد'
        : 'Save limit',
  );

  readonly canSave = computed(() => {
    const draft = this.facade.parsedDraft();
    return (
      this.facade.isDirty() &&
      draft !== null &&
      draft >= 1 &&
      !this.facade.saving()
    );
  });

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  onDraftChange(value: string): void {
    this.facade.setDraft(value);
  }

  save(): void {
    if (!this.canSave()) return;
    this.facade.save();
  }

  resetDraft(): void {
    this.facade.resetDraft();
  }

  dayLabel(day: CapacityDaySnapshot): string {
    return pickLocale(day.weekdayLabel, this.locale.locale());
  }

  dayFill(day: CapacityDaySnapshot): number {
    if (day.limit <= 0) return 0;
    return Math.min(100, Math.round((day.confirmed / day.limit) * 100));
  }
}
