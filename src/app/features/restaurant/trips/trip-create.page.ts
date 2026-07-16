import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideLoaderCircle,
  lucideMapPinned,
  lucidePackage,
  lucideRoute,
  lucideTriangleAlert,
  lucideUserRound,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsDetailHeroComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { TripsFacade } from './data/trips.facade';
import {
  TripCandidateStop,
  TripDriverOption,
} from './models/trip.model';
import { TripsSkeletonComponent } from './trips-skeleton.component';

@Component({
  selector: 'mm-trip-create-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    TripsSkeletonComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsDetailHeroComponent,
  ],
  templateUrl: './trip-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-tp-create-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideLoaderCircle,
      lucideMapPinned,
      lucidePackage,
      lucideRoute,
      lucideTriangleAlert,
      lucideUserRound,
    }),
  ],
})
export class TripCreatePageComponent implements OnInit {
  readonly facade = inject(TripsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly router = inject(Router);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'إنشاء رحلة' : 'Create trip',
  );

  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'اختر البوكسات/المحطات ثم عيّن السائق للرحلة.'
      : 'Select boxes/stops, then assign a driver to the trip.',
  );

  readonly errorMessage = computed(() => {
    const code = this.facade.createError();
    if (!code) return '';
    const rtl = this.locale.isRtl();
    switch (code) {
      case 'missing':
        return rtl
          ? 'اختر محطة واحدة على الأقل وسائقًا.'
          : 'Pick at least one stop and a driver.';
      case 'driver':
        return rtl
          ? 'السائق غير متاح أو غير مفعّل.'
          : 'Selected driver is unavailable or not enabled.';
      case 'stops':
        return rtl
          ? 'المحطات المحددة غير متاحة.'
          : 'Selected stops are no longer available.';
      default:
        return rtl ? 'تعذّر إنشاء الرحلة.' : 'Could not create the trip.';
    }
  });

  ngOnInit(): void {
    this.facade.ensureLoaded();
    this.facade.resetCreateDraft();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  zone(item: TripCandidateStop): string {
    return pickLocale(item.zoneLabel, this.locale.locale());
  }

  meal(item: TripCandidateStop): string {
    return pickLocale(item.mealSummary, this.locale.locale());
  }

  slot(item: TripCandidateStop): string {
    return pickLocale(item.slotLabel, this.locale.locale());
  }

  shift(item: TripCandidateStop): string {
    return pickLocale(item.shiftLabel, this.locale.locale());
  }

  driverName(driver: TripDriverOption): string {
    return pickLocale(driver.name, this.locale.locale());
  }

  vehicle(driver: TripDriverOption): string {
    return pickLocale(driver.vehicleLabel, this.locale.locale());
  }

  isStopSelected(id: string): boolean {
    return this.facade.selectedStopIds().includes(id);
  }

  toggleStop(id: string): void {
    this.facade.toggleStop(id);
  }

  selectDriver(id: string): void {
    this.facade.selectDriver(id);
  }

  submit(): void {
    this.facade.createTrip((tripId) => {
      void this.router.navigate(['/restaurant/delivery/trips', tripId]);
    });
  }
}
