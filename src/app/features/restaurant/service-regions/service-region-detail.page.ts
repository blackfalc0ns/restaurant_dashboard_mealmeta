import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBoxes,
  lucideCalendarClock,
  lucideCheck,
  lucideChevronDown,
  lucideChevronUp,
  lucideCircleCheck,
  lucideClock3,
  lucideHistory,
  lucideMapPin,
  lucideMapPinned,
  lucideNavigation,
  lucidePause,
  lucidePlay,
  lucideRoute,
  lucideTruck,
  lucideUserRound,
} from '@ng-icons/lucide';
import { timer } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsMainComponent,
  RestaurantOpsSectionHeadComponent,
  RestaurantOpsSideCardComponent,
  RestaurantOpsSideComponent,
  RestaurantOpsSplitComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { ServiceRegionDetailSkeletonComponent } from './service-region-detail-skeleton.component';

type RegionStatus = 'active' | 'paused';
type TripStatus = 'preparing' | 'assigned' | 'in_transit' | 'completed';

interface RegionInfo {
  ar: string;
  en: string;
  neighborhoods: string[];
  deliveryWindowAr: string;
  deliveryWindowEn: string;
  serviceDays: number;
  status: RegionStatus;
}

interface RegionTrip {
  id: string;
  code: string;
  status: TripStatus;
  scheduledAtAr: string;
  scheduledAtEn: string;
  boxCount: number;
  scannedBoxes: number;
  driver?: {
    name: string;
    phone: string;
    vehicleAr: string;
    vehicleEn: string;
  };
  neighborhoods: string[];
  boxCodes: string[];
  createdByAr: string;
  createdByEn: string;
  createdAtAr: string;
  createdAtEn: string;
}

interface AuditEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  timeAr: string;
  timeEn: string;
}

const REGIONS: Record<string, RegionInfo> = {
  hawalli: {
    ar: 'حولي',
    en: 'Hawalli',
    neighborhoods: ['الرميثية', 'بيان', 'مشرف', 'سلوى', 'الجابرية', 'الشعب'],
    deliveryWindowAr: '11:00 ص – 2:00 م',
    deliveryWindowEn: '11:00 AM – 2:00 PM',
    serviceDays: 6,
    status: 'active',
  },
  salmiya: {
    ar: 'السالمية',
    en: 'Salmiya',
    neighborhoods: ['السالمية', 'حولي', 'الشعب', 'البدع', 'الروضة'],
    deliveryWindowAr: '11:00 ص – 2:00 م',
    deliveryWindowEn: '11:00 AM – 2:00 PM',
    serviceDays: 6,
    status: 'active',
  },
  'kuwait-city': {
    ar: 'مدينة الكويت',
    en: 'Kuwait City',
    neighborhoods: [
      'الشرق',
      'القبلة',
      'المرقاب',
      'دسمان',
      'الصوابر',
      'الوسطى',
      'الشويخ',
    ],
    deliveryWindowAr: '12:00 م – 3:00 م',
    deliveryWindowEn: '12:00 PM – 3:00 PM',
    serviceDays: 6,
    status: 'active',
  },
  farwaniya: {
    ar: 'الفروانية',
    en: 'Farwaniya',
    neighborhoods: ['الفروانية', 'خيطان', 'العمرية', 'الأندلس'],
    deliveryWindowAr: '12:00 م – 3:00 م',
    deliveryWindowEn: '12:00 PM – 3:00 PM',
    serviceDays: 6,
    status: 'active',
  },
  jahra: {
    ar: 'الجهراء',
    en: 'Al Jahra',
    neighborhoods: ['الجهراء', 'النعيم', 'القصر'],
    deliveryWindowAr: '—',
    deliveryWindowEn: '—',
    serviceDays: 0,
    status: 'paused',
  },
  mubarak: {
    ar: 'مبارك الكبير',
    en: 'Mubarak Al-Kabeer',
    neighborhoods: ['صباح السالم', 'العدان', 'القرين', 'القصور'],
    deliveryWindowAr: '—',
    deliveryWindowEn: '—',
    serviceDays: 0,
    status: 'paused',
  },
};

@Component({
  selector: 'mm-service-region-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    ServiceRegionDetailSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsSplitComponent,
    RestaurantOpsMainComponent,
    RestaurantOpsSideComponent,
    RestaurantOpsSideCardComponent,
    RestaurantOpsSectionHeadComponent,
  ],
  templateUrl: './service-region-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ops-detail-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBoxes,
      lucideCalendarClock,
      lucideCheck,
      lucideChevronDown,
      lucideChevronUp,
      lucideCircleCheck,
      lucideClock3,
      lucideHistory,
      lucideMapPin,
      lucideMapPinned,
      lucideNavigation,
      lucidePause,
      lucidePlay,
      lucideRoute,
      lucideTruck,
      lucideUserRound,
    }),
  ],
})
export class ServiceRegionDetailPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);

  private readonly regionId =
    this.route.snapshot.paramMap.get('regionId') ?? 'hawalli';

  readonly region = computed(
    () => REGIONS[this.regionId] ?? REGIONS['hawalli'],
  );

  readonly status = signal<RegionStatus>(this.region().status);
  readonly expandedTripId = signal<string | null>(null);

  readonly trips: RegionTrip[] = [
    {
      id: 'trip-240714-01',
      code: 'TR-0714-01',
      status: 'in_transit',
      scheduledAtAr: 'اليوم · 11:00 ص',
      scheduledAtEn: 'Today · 11:00 AM',
      boxCount: 18,
      scannedBoxes: 18,
      driver: {
        name: 'أحمد سالم',
        phone: '+965 5550 2140',
        vehicleAr: 'سيارة مبردة · 24-581',
        vehicleEn: 'Refrigerated van · 24-581',
      },
      neighborhoods: ['الرميثية', 'بيان', 'مشرف'],
      boxCodes: [
        'BX-1042',
        'BX-1043',
        'BX-1044',
        'BX-1045',
        'BX-1046',
        'BX-1047',
      ],
      createdByAr: 'مسؤول التوصيل · خالد محمد',
      createdByEn: 'Delivery lead · Khaled Mohamed',
      createdAtAr: 'اليوم · 8:35 ص',
      createdAtEn: 'Today · 8:35 AM',
    },
    {
      id: 'trip-240714-02',
      code: 'TR-0714-02',
      status: 'assigned',
      scheduledAtAr: 'اليوم · 1:30 م',
      scheduledAtEn: 'Today · 1:30 PM',
      boxCount: 12,
      scannedBoxes: 8,
      driver: {
        name: 'يوسف علي',
        phone: '+965 5558 9031',
        vehicleAr: 'دراجة توصيل · 18-224',
        vehicleEn: 'Delivery bike · 18-224',
      },
      neighborhoods: ['سلوى', 'الجابرية'],
      boxCodes: ['BX-1081', 'BX-1082', 'BX-1083', 'BX-1084', 'BX-1085'],
      createdByAr: 'مسؤول التوصيل · خالد محمد',
      createdByEn: 'Delivery lead · Khaled Mohamed',
      createdAtAr: 'اليوم · 9:10 ص',
      createdAtEn: 'Today · 9:10 AM',
    },
    {
      id: 'trip-240713-03',
      code: 'TR-0713-03',
      status: 'completed',
      scheduledAtAr: 'أمس · 12:00 م',
      scheduledAtEn: 'Yesterday · 12:00 PM',
      boxCount: 21,
      scannedBoxes: 21,
      driver: {
        name: 'محمود حسن',
        phone: '+965 5551 4472',
        vehicleAr: 'سيارة مبردة · 32-190',
        vehicleEn: 'Refrigerated van · 32-190',
      },
      neighborhoods: ['الرميثية', 'بيان', 'مشرف', 'الشعب'],
      boxCodes: [
        'BX-0994',
        'BX-0995',
        'BX-0996',
        'BX-0997',
        'BX-0998',
        'BX-0999',
      ],
      createdByAr: 'مسؤول التوصيل · منى أحمد',
      createdByEn: 'Delivery lead · Mona Ahmed',
      createdAtAr: 'أمس · 8:05 ص',
      createdAtEn: 'Yesterday · 8:05 AM',
    },
  ];

  readonly audit: AuditEvent[] = [
    {
      id: 'a1',
      titleAr: 'تفعيل المنطقة',
      titleEn: 'Region activated',
      timeAr: 'منذ 12 دقيقة',
      timeEn: '12 min ago',
    },
    {
      id: 'a2',
      titleAr: 'تحديث نافذة التسليم',
      titleEn: 'Delivery window updated',
      timeAr: 'أمس · 4:32 م',
      timeEn: 'Yesterday · 4:32 PM',
    },
    {
      id: 'a3',
      titleAr: 'إضافة حي جديد · الشعب',
      titleEn: 'Neighborhood added · Al Shaab',
      timeAr: 'منذ 3 أيام',
      timeEn: '3 days ago',
    },
  ];

  readonly regionName = computed(() =>
    this.text(this.region().ar, this.region().en),
  );

  readonly deliveryWindow = computed(() =>
    this.text(this.region().deliveryWindowAr, this.region().deliveryWindowEn),
  );

  readonly statusLabel = computed(() =>
    this.status() === 'active'
      ? this.text('مفعّلة', 'Active')
      : this.text('موقوفة', 'Suspended'),
  );

  readonly actionLabel = computed(() =>
    this.status() === 'active'
      ? this.text('إيقاف المنطقة', 'Suspend region')
      : this.text('تفعيل المنطقة', 'Activate region'),
  );

  readonly liveTrips = computed(
    () => this.trips.filter((trip) => trip.status !== 'completed').length,
  );

  readonly totalBoxesLive = computed(() =>
    this.trips
      .filter((trip) => trip.status !== 'completed')
      .reduce((sum, trip) => sum + trip.boxCount, 0),
  );

  ngOnInit(): void {
    timer(750)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loading.set(false));
  }

  toggleStatus(): void {
    this.status.update((value) => (value === 'active' ? 'paused' : 'active'));
  }

  toggleTrip(tripId: string): void {
    this.expandedTripId.update((current) =>
      current === tripId ? null : tripId,
    );
  }

  isExpanded(tripId: string): boolean {
    return this.expandedTripId() === tripId;
  }

  tripStatusLabel(status: TripStatus): string {
    const labels: Record<TripStatus, [string, string]> = {
      preparing: ['جاري التجهيز', 'Preparing'],
      assigned: ['مندوب معيّن', 'Assigned'],
      in_transit: ['قيد التوصيل', 'In transit'],
      completed: ['مكتملة', 'Completed'],
    };
    return this.text(labels[status][0], labels[status][1]);
  }

  scanPct(trip: RegionTrip): number {
    if (!trip.boxCount) return 0;
    return Math.round((trip.scannedBoxes / trip.boxCount) * 100);
  }

  routePreview(trip: RegionTrip): string {
    return trip.neighborhoods.slice(0, 2).join(' · ');
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }
}
