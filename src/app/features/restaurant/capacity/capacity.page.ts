import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideBan,
  lucideCalendarDays,
  lucideGauge,
  lucideInfo,
  lucideLoaderCircle,
  lucideLockOpen,
  lucidePackage,
  lucidePackagePlus,
  lucideSave,
  lucideShieldCheck,
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
import { BusyKind, CapacityDaySnapshot } from './models/capacity.model';

@Component({
  selector: 'mm-capacity-page',
  standalone: true,
  imports: [
    FormsModule,
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
      lucideBan,
      lucideCalendarDays,
      lucideGauge,
      lucideInfo,
      lucideLoaderCircle,
      lucideLockOpen,
      lucidePackage,
      lucidePackagePlus,
      lucideSave,
      lucideShieldCheck,
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

  readonly capacityNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.capacityNote, this.locale.locale()) : '';
  });

  readonly busyNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.busyNote, this.locale.locale()) : '';
  });

  readonly updatedAt = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.updatedAtLabel, this.locale.locale()) : '';
  });

  readonly remainingLabel = computed(() =>
    this.facade.isAtCapacityToday()
      ? this.locale.isRtl()
        ? 'مكتمل'
        : 'Full'
      : String(this.facade.remaining()),
  );

  readonly statusLabel = computed(() => {
    const today = this.facade.today();
    if (today?.busyKind === 'manual') {
      return this.locale.isRtl() ? 'مشغول يدويًا' : 'Manual Busy';
    }
    if (this.facade.isAtCapacityToday()) {
      return this.locale.isRtl() ? 'مشغول تلقائيًا' : 'Auto Busy';
    }
    if (this.facade.isNearLimit()) {
      return this.locale.isRtl() ? 'قرب الحد' : 'Near limit';
    }
    return this.locale.isRtl() ? 'متاح' : 'Available';
  });

  readonly statusTone = computed((): 'ok' | 'warn' | 'busy' | 'manual' => {
    const today = this.facade.today();
    if (today?.busyKind === 'manual') return 'manual';
    if (this.facade.isAtCapacityToday()) return 'busy';
    if (this.facade.isNearLimit()) return 'warn';
    return 'ok';
  });

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
      draft > this.facade.currentLimit() &&
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

  increaseBy(amount: number): void {
    this.facade.increaseDraft(amount);
  }

  weekdayLabel(day: CapacityDaySnapshot): string {
    return pickLocale(day.weekdayLabel, this.locale.locale());
  }

  dateLabelFor(day: CapacityDaySnapshot): string {
    return pickLocale(day.dateLabel, this.locale.locale());
  }

  dayFill(day: CapacityDaySnapshot): number {
    if (day.limit <= 0) return 0;
    return Math.min(100, Math.round((day.confirmed / day.limit) * 100));
  }

  busyLabel(kind: BusyKind): string {
    const rtl = this.locale.isRtl();
    if (kind === 'manual') return rtl ? 'مشغول يدويًا' : 'Manual Busy';
    if (kind === 'capacity') return rtl ? 'مشغول تلقائيًا' : 'Auto Busy';
    return rtl ? 'متاح' : 'Open';
  }

  busyTone(kind: BusyKind): 'ok' | 'busy' | 'manual' {
    if (kind === 'manual') return 'manual';
    if (kind === 'capacity') return 'busy';
    return 'ok';
  }

  isToggling(day: CapacityDaySnapshot): boolean {
    return this.facade.togglingDate() === day.dateIso;
  }

  canMarkBusy(day: CapacityDaySnapshot): boolean {
    return (
      day.canToggleManual &&
      !day.manualBusy &&
      day.busyKind !== 'capacity' &&
      !this.isToggling(day)
    );
  }

  canClearBusy(day: CapacityDaySnapshot): boolean {
    return day.canToggleManual && day.manualBusy && !this.isToggling(day);
  }

  toggleBusy(day: CapacityDaySnapshot): void {
    if (day.manualBusy) {
      this.facade.clearManualBusy(day.dateIso);
      return;
    }
    if (this.canMarkBusy(day)) {
      this.facade.setManualBusy(day.dateIso);
    }
  }
}
