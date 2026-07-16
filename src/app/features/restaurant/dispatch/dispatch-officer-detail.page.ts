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
  lucideClipboardList,
  lucideClock3,
  lucideHistory,
  lucideIdCard,
  lucideInfo,
  lucideLoaderCircle,
  lucideMail,
  lucideMapPinned,
  lucidePackage,
  lucidePause,
  lucidePhone,
  lucidePlay,
  lucideRoute,
  lucideSmartphone,
  lucideTriangleAlert,
  lucideUserRound,
  lucideUsers,
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
import { TripsFacade } from '../trips/data/trips.facade';
import { DeliveryTrip, TripStatus } from '../trips/models/trip.model';
import { DispatchOfficersFacade } from './data/dispatch-officers.facade';
import { DispatchOfficersSkeletonComponent } from './dispatch-officers-skeleton.component';
import {
  DispatchOfficer,
  DispatchOfficerStatus,
  DispatchOfficerTimelineEvent,
} from './models/dispatch-officer.model';

@Component({
  selector: 'mm-dispatch-officer-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    DispatchOfficersSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsSplitComponent,
    RestaurantOpsMainComponent,
    RestaurantOpsSideComponent,
    RestaurantOpsSideCardComponent,
  ],
  templateUrl: './dispatch-officer-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-dsp-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideClipboardList,
      lucideClock3,
      lucideHistory,
      lucideIdCard,
      lucideInfo,
      lucideLoaderCircle,
      lucideMail,
      lucideMapPinned,
      lucidePackage,
      lucidePause,
      lucidePhone,
      lucidePlay,
      lucideRoute,
      lucideSmartphone,
      lucideTriangleAlert,
      lucideUserRound,
      lucideUsers,
    }),
  ],
})
export class DispatchOfficerDetailPageComponent implements OnInit {
  readonly facade = inject(DispatchOfficersFacade);
  readonly tripsFacade = inject(TripsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly officerId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('officerId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('officerId') ?? '' },
  );

  readonly officer = computed(() => {
    const id = this.officerId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.officerById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.officerId() &&
      !this.officer(),
  );

  readonly officerTrips = computed(() => {
    const id = this.officerId();
    if (!id || this.tripsFacade.page().viewState !== 'success') return [];
    return (this.tripsFacade.data()?.trips ?? []).filter(
      (trip) => trip.dispatcherId === id,
    );
  });

  ngOnInit(): void {
    this.facade.ensureLoaded();
    this.tripsFacade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  name(officer: DispatchOfficer): string {
    return pickLocale(officer.name, this.locale.locale());
  }

  joinedAt(officer: DispatchOfficer): string {
    return pickLocale(officer.joinedAtLabel, this.locale.locale());
  }

  updatedAt(officer: DispatchOfficer): string {
    return pickLocale(officer.updatedAtLabel, this.locale.locale());
  }

  officerNote(officer: DispatchOfficer): string {
    return officer.note ? pickLocale(officer.note, this.locale.locale()) : '';
  }

  eventTitle(event: DispatchOfficerTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: DispatchOfficerTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  statusLabel(status: DispatchOfficerStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'active':
        return rtl ? 'مفعّل' : 'Active';
      case 'disabled':
        return rtl ? 'معطّل' : 'Disabled';
      case 'invited':
        return rtl ? 'مدعوّ' : 'Invited';
    }
  }

  tripStatusLabel(status: TripStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'draft':
        return rtl ? 'مسودة' : 'Draft';
      case 'assigned':
        return rtl ? 'مسنَدة' : 'Assigned';
      case 'in_progress':
        return rtl ? 'قيد التنفيذ' : 'In progress';
      case 'completed':
        return rtl ? 'مكتملة' : 'Completed';
      case 'cancelled':
        return rtl ? 'ملغاة' : 'Cancelled';
    }
  }

  tripZone(trip: DeliveryTrip): string {
    return pickLocale(trip.zoneLabel, this.locale.locale());
  }

  tripDriver(trip: DeliveryTrip): string {
    return trip.driverName
      ? pickLocale(trip.driverName, this.locale.locale())
      : this.text('بدون سائق', 'No driver');
  }

  tripCreatedAt(trip: DeliveryTrip): string {
    return pickLocale(trip.createdAtLabel, this.locale.locale());
  }

  initials(officer: DispatchOfficer): string {
    const name = this.name(officer).trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'D';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  canToggle(officer: DispatchOfficer): boolean {
    return officer.status === 'active' || officer.status === 'disabled';
  }

  isToggling(officer: DispatchOfficer): boolean {
    return this.facade.togglingId() === officer.id;
  }

  toggleLabel(officer: DispatchOfficer): string {
    const rtl = this.locale.isRtl();
    if (officer.status === 'disabled') {
      return rtl ? 'تفعيل الحساب' : 'Enable account';
    }
    return rtl ? 'تعطيل الحساب' : 'Disable account';
  }

  toggle(officer: DispatchOfficer): void {
    if (!this.canToggle(officer) || this.isToggling(officer)) return;
    this.facade.toggleEnabled(officer.id);
  }
}
