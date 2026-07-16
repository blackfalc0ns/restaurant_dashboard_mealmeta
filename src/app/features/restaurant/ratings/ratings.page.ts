import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideInfo,
  lucideSearch,
  lucideStar,
  lucideTrendingDown,
  lucideTrendingUp,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { RatingsFacade } from './data/ratings.facade';
import {
  MealRatingHighlight,
  RatingFilter,
  RestaurantRating,
} from './models/rating.model';
import { RatingsSkeletonComponent } from './ratings-skeleton.component';

@Component({
  selector: 'mm-ratings-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgIcon,
    PageStateComponent,
    RatingsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './ratings.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-rt-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideInfo,
      lucideSearch,
      lucideStar,
      lucideTrendingDown,
      lucideTrendingUp,
    }),
  ],
})
export class RatingsPageComponent implements OnInit {
  readonly facade = inject(RatingsFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: { id: RatingFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'five', labelAr: '5 نجوم', labelEn: '5 stars' },
    { id: 'four', labelAr: '4 نجوم', labelEn: '4 stars' },
    { id: 'three', labelAr: '3 نجوم', labelEn: '3 stars' },
    { id: 'low', labelAr: 'منخفض ≤2', labelEn: 'Low ≤2' },
  ];

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

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث بالوجبة أو التعليق أو رقم الطلب...'
      : 'Search by meal, comment, or order ref...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد تقييمات مطابقة للبحث أو التصفية.'
      : 'No ratings match this search or filter.',
  );

  readonly rangeText = computed(() => {
    const range = this.facade.rangeLabel();
    if (range.total === 0) {
      return this.locale.isRtl() ? 'لا نتائج' : 'No results';
    }
    return this.locale.isRtl()
      ? `عرض ${range.from}–${range.to} من ${range.total}`
      : `Showing ${range.from}–${range.to} of ${range.total}`;
  });

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly avgStars = computed(() => {
    const rating = Math.round(this.facade.data()?.averageRating ?? 0);
    return Array.from({ length: 5 }, (_, index) => index < rating);
  });

  ngOnInit(): void {
    this.facade.load();
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: RatingFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: RatingFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  mealName(item: MealRatingHighlight | RestaurantRating): string {
    return pickLocale(item.mealName, this.locale.locale());
  }

  ratingComment(item: RestaurantRating): string {
    return pickLocale(item.comment, this.locale.locale());
  }

  ratingTime(item: RestaurantRating): string {
    return pickLocale(item.timeLabel, this.locale.locale());
  }

  programLabel(item: RestaurantRating): string {
    return pickLocale(item.programLabel, this.locale.locale());
  }

  starFlags(count: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < count);
  }

  prevPage(): void {
    this.facade.prevPage();
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  goToPage(page: number): void {
    this.facade.goToPage(page);
  }
}
