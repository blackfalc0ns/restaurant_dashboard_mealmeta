import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCar,
  lucideCircleCheck,
  lucideClock3,
  lucideFileText,
  lucideHistory,
  lucideIdCard,
  lucideInfo,
  lucideLoaderCircle,
  lucideMail,
  lucidePause,
  lucidePhone,
  lucidePlay,
  lucideShieldAlert,
  lucideTriangleAlert,
  lucideUserRound,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsMainComponent,
  RestaurantOpsSideCardComponent,
  RestaurantOpsSideComponent,
  RestaurantOpsSplitComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { DriversFacade } from './data/drivers.facade';
import { DriverDetailSkeletonComponent } from './driver-detail-skeleton.component';
import {
  DriverDocument,
  DriverDocumentStatus,
  DriverStatus,
  DriverTimelineEvent,
  RestaurantDriver,
} from './models/driver.model';

@Component({
  selector: 'mm-driver-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    DriverDetailSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsSplitComponent,
    RestaurantOpsMainComponent,
    RestaurantOpsSideComponent,
    RestaurantOpsSideCardComponent,
  ],
  templateUrl: './driver-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-dr-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCar,
      lucideCircleCheck,
      lucideClock3,
      lucideFileText,
      lucideHistory,
      lucideIdCard,
      lucideInfo,
      lucideLoaderCircle,
      lucideMail,
      lucidePause,
      lucidePhone,
      lucidePlay,
      lucideShieldAlert,
      lucideTriangleAlert,
      lucideUserRound,
    }),
  ],
})
export class DriverDetailPageComponent implements OnInit {
  readonly facade = inject(DriversFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly driverId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('driverId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('driverId') ?? '' },
  );

  readonly driver = computed(() => {
    const id = this.driverId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.driverById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.driverId() &&
      !this.driver(),
  );

  ngOnInit(): void {
    this.facade.ensureLoaded();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  name(driver: RestaurantDriver): string {
    return pickLocale(driver.name, this.locale.locale());
  }

  initials(driver: RestaurantDriver): string {
    const label = this.name(driver).trim();
    const parts = label.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'DR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  vehicleType(driver: RestaurantDriver): string {
    return pickLocale(driver.vehicleType, this.locale.locale());
  }

  vehicleColor(driver: RestaurantDriver): string {
    return pickLocale(driver.vehicleColor, this.locale.locale());
  }

  licenseExpiry(driver: RestaurantDriver): string {
    return pickLocale(driver.licenseExpiryLabel, this.locale.locale());
  }

  joinedAt(driver: RestaurantDriver): string {
    return pickLocale(driver.joinedAtLabel, this.locale.locale());
  }

  updatedAt(driver: RestaurantDriver): string {
    return pickLocale(driver.updatedAtLabel, this.locale.locale());
  }

  note(driver: RestaurantDriver): string {
    return driver.note ? pickLocale(driver.note, this.locale.locale()) : '';
  }

  docLabel(doc: DriverDocument): string {
    return pickLocale(doc.label, this.locale.locale());
  }

  docUpdated(doc: DriverDocument): string {
    return pickLocale(doc.updatedAtLabel, this.locale.locale());
  }

  eventTitle(event: DriverTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: DriverTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  toneIcon(tone: DriverTimelineEvent['tone']): string {
    switch (tone) {
      case 'ok':
        return 'lucideCircleCheck';
      case 'warn':
        return 'lucideTriangleAlert';
      case 'danger':
        return 'lucideShieldAlert';
      default:
        return 'lucideHistory';
    }
  }

  statusLabel(status: DriverStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'active':
        return rtl ? 'مفعّل' : 'Active';
      case 'disabled':
        return rtl ? 'معطّل' : 'Disabled';
      case 'pending':
        return rtl ? 'بانتظار الاعتماد' : 'Pending approval';
      case 'rejected':
        return rtl ? 'مرفوض' : 'Rejected';
      case 'license_alert':
        return rtl ? 'تنبيه رخصة' : 'License alert';
    }
  }

  docStatusLabel(status: DriverDocumentStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'verified':
        return rtl ? 'موثّقة' : 'Verified';
      case 'pending':
        return rtl ? 'قيد المراجعة' : 'Pending';
      case 'rejected':
        return rtl ? 'مرفوضة' : 'Rejected';
      case 'expiring':
        return rtl ? 'قرب الانتهاء' : 'Expiring';
    }
  }

  canToggle(driver: RestaurantDriver): boolean {
    return (
      driver.status === 'active' ||
      driver.status === 'disabled' ||
      driver.status === 'license_alert'
    );
  }

  isToggling(driver: RestaurantDriver): boolean {
    return this.facade.togglingId() === driver.id;
  }

  toggleLabel(driver: RestaurantDriver): string {
    return driver.status === 'disabled'
      ? this.text('تفعيل السائق', 'Enable driver')
      : this.text('تعطيل السائق', 'Disable driver');
  }

  toggle(driver: RestaurantDriver): void {
    if (!this.canToggle(driver) || this.isToggling(driver)) return;
    this.facade.toggleEnabled(driver.id);
  }
}
