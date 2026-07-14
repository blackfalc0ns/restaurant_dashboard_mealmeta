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
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideClock3,
  lucideGlobe,
  lucideMapPin,
  lucideSearch,
  lucideShieldCheck,
  lucideToggleLeft,
  lucideToggleRight,
} from '@ng-icons/lucide';
import { timer } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { ServiceRegionsSkeletonComponent } from './service-regions-skeleton.component';

type RegionStatus = 'active' | 'paused';

interface ServiceRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  neighborhoods: number;
  etaAr: string;
  etaEn: string;
  status: RegionStatus;
  updatedAr: string;
  updatedEn: string;
}

@Component({
  selector: 'mm-service-regions-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    ServiceRegionsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './service-regions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ops-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideClock3,
      lucideGlobe,
      lucideMapPin,
      lucideSearch,
      lucideShieldCheck,
      lucideToggleLeft,
      lucideToggleRight,
    }),
  ],
})
export class ServiceRegionsPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly search = signal('');
  readonly filter = signal<'all' | RegionStatus>('all');
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly regions = signal<ServiceRegion[]>([
    {
      id: 'hawalli',
      nameAr: 'حولي',
      nameEn: 'Hawalli',
      neighborhoods: 6,
      etaAr: '11 ص – 2 م',
      etaEn: '11 AM – 2 PM',
      status: 'active',
      updatedAr: 'منذ 12 دقيقة',
      updatedEn: '12 min ago',
    },
    {
      id: 'salmiya',
      nameAr: 'السالمية',
      nameEn: 'Salmiya',
      neighborhoods: 5,
      etaAr: '11 ص – 2 م',
      etaEn: '11 AM – 2 PM',
      status: 'active',
      updatedAr: 'منذ 28 دقيقة',
      updatedEn: '28 min ago',
    },
    {
      id: 'kuwait-city',
      nameAr: 'مدينة الكويت',
      nameEn: 'Kuwait City',
      neighborhoods: 7,
      etaAr: '12 – 3 م',
      etaEn: '12 – 3 PM',
      status: 'active',
      updatedAr: 'منذ ساعة',
      updatedEn: '1 hour ago',
    },
    {
      id: 'farwaniya',
      nameAr: 'الفروانية',
      nameEn: 'Farwaniya',
      neighborhoods: 4,
      etaAr: '12 – 3 م',
      etaEn: '12 – 3 PM',
      status: 'active',
      updatedAr: 'منذ ساعتين',
      updatedEn: '2 hours ago',
    },
    {
      id: 'jahra',
      nameAr: 'الجهراء',
      nameEn: 'Al Jahra',
      neighborhoods: 3,
      etaAr: '—',
      etaEn: '—',
      status: 'paused',
      updatedAr: 'منذ أمس',
      updatedEn: 'Yesterday',
    },
    {
      id: 'mubarak',
      nameAr: 'مبارك الكبير',
      nameEn: 'Mubarak Al-Kabeer',
      neighborhoods: 4,
      etaAr: '—',
      etaEn: '—',
      status: 'paused',
      updatedAr: 'منذ أمس',
      updatedEn: 'Yesterday',
    },
  ]);

  readonly filteredRegions = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.filter();
    return this.regions().filter((region) => {
      const matchesQuery =
        !query ||
        `${region.nameAr} ${region.nameEn}`.toLowerCase().includes(query);
      return matchesQuery && (status === 'all' || region.status === status);
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRegions().length / this.pageSize)),
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly pagedRegions = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return this.filteredRegions().slice(start, start + this.pageSize);
  });

  readonly rangeText = computed(() => {
    const total = this.filteredRegions().length;
    if (total === 0) {
      return this.text('لا نتائج', 'No results');
    }
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return this.text(
      `${from}–${to} من ${total}`,
      `${from}–${to} of ${total}`,
    );
  });

  readonly activeCount = computed(
    () => this.regions().filter((region) => region.status === 'active').length,
  );
  readonly pausedCount = computed(
    () => this.regions().filter((region) => region.status === 'paused').length,
  );
  readonly totalNeighborhoods = computed(() =>
    this.regions().reduce((sum, region) => sum + region.neighborhoods, 0),
  );

  ngOnInit(): void {
    timer(650)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loading.set(false));
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  eta(region: ServiceRegion): string {
    return this.text(region.etaAr, region.etaEn);
  }

  updated(region: ServiceRegion): string {
    return this.text(region.updatedAr, region.updatedEn);
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  setFilter(value: 'all' | RegionStatus): void {
    this.filter.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  toggle(region: ServiceRegion, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.regions.update((items) =>
      items.map((item) =>
        item.id === region.id
          ? {
              ...item,
              status: item.status === 'active' ? 'paused' : 'active',
            }
          : item,
      ),
    );
  }
}
