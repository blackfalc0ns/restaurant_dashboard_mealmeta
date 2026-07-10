import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideChevronLeft,
  lucideChevronRight,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideClock,
  lucideGauge,
  lucideInfo,
  lucideLandmark,
  lucideMessageSquareWarning,
  lucidePackage,
  lucideScanBarcode,
  lucideSiren,
  lucideStar,
  lucideTriangleAlert,
  lucideUserRound,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../overview-i18n';
import { ActivitySkeletonComponent } from './activity-skeleton.component';
import { RestaurantActivityFacade } from './data/restaurant-activity.facade';
import {
  ActivityFeedItem,
  ActivityFilter,
  ActivityMetaChip,
  ActivityQuickLink,
  ActivitySeverity,
  ActivitySummaryCard,
  ActivityTimelineItem,
} from './models/restaurant-activity.model';

@Component({
  selector: 'mm-restaurant-activity-page',
  standalone: true,
  imports: [RouterLink, NgIcon, PageStateComponent, ActivitySkeletonComponent],
  templateUrl: './restaurant-activity.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ac-page block' },
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCircleAlert,
      lucideCircleCheck,
      lucideClock,
      lucideGauge,
      lucideInfo,
      lucideLandmark,
      lucideMessageSquareWarning,
      lucidePackage,
      lucideScanBarcode,
      lucideSiren,
      lucideStar,
      lucideTriangleAlert,
      lucideUserRound,
    }),
  ],
})
export class RestaurantActivityPageComponent implements OnInit {
  readonly facade = inject(RestaurantActivityFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{ id: ActivityFilter; labelAr: string; labelEn: string }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'critical', labelAr: 'حرج', labelEn: 'Critical' },
    { id: 'ops', labelAr: 'تشغيل', labelEn: 'Operations' },
    { id: 'finance', labelAr: 'مالية', labelEn: 'Finance' },
    { id: 'quality', labelAr: 'جودة', labelEn: 'Quality' },
  ];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly attentionTitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.attention.title, this.locale.locale()) : '';
  });

  readonly attentionDetail = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.attention.detail, this.locale.locale()) : '';
  });

  readonly attentionAction = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.attention.actionLabel, this.locale.locale()) : '';
  });

  readonly feedTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة المتابعة التفصيلية' : 'Detailed follow-up list',
  );

  readonly feedSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'كل عنصر يوضح الأثر وSLA والمسؤول والإجراء'
      : 'Each item shows impact, SLA, owner, and action',
  );

  readonly timelineTitle = computed(() =>
    this.locale.isRtl() ? 'الخط الزمني للأحداث' : 'Events timeline',
  );

  readonly linksTitle = computed(() =>
    this.locale.isRtl() ? 'اختصارات سريعة' : 'Quick shortcuts',
  );

  readonly linksSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'انتقل مباشرة لأهم شاشات المتابعة'
      : 'Jump straight to key follow-up screens',
  );

  readonly emptyFeed = computed(() =>
    this.locale.isRtl() ? 'لا توجد عناصر في هذا التصفية' : 'No items in this filter',
  );

  readonly impactLabel = computed(() =>
    this.locale.isRtl() ? 'الأثر' : 'Impact',
  );

  readonly ownerLabel = computed(() =>
    this.locale.isRtl() ? 'المسؤول' : 'Owner',
  );

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly rangeText = computed(() => {
    const range = this.facade.rangeLabel();
    if (range.total === 0) {
      return this.locale.isRtl() ? 'لا عناصر' : 'No items';
    }
    return this.locale.isRtl()
      ? `عرض ${range.from}–${range.to} من ${range.total}`
      : `Showing ${range.from}–${range.to} of ${range.total}`;
  });

  readonly pageOfText = computed(() => {
    const current = Math.min(this.facade.currentPage(), this.facade.totalPages());
    const total = this.facade.totalPages();
    return this.locale.isRtl()
      ? `صفحة ${current} من ${total}`
      : `Page ${current} of ${total}`;
  });

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: ActivityFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: ActivitySummaryCard): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: ActivitySummaryCard): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  itemTitle(item: ActivityFeedItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  itemDetail(item: ActivityFeedItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  itemImpact(item: ActivityFeedItem): string {
    return pickLocale(item.impact, this.locale.locale());
  }

  itemTime(item: ActivityFeedItem): string {
    return pickLocale(item.timeLabel, this.locale.locale());
  }

  itemAction(item: ActivityFeedItem): string {
    return pickLocale(item.actionLabel, this.locale.locale());
  }

  itemOwner(item: ActivityFeedItem): string {
    return pickLocale(item.owner, this.locale.locale());
  }

  itemSla(item: ActivityFeedItem): string | null {
    return item.slaLabel ? pickLocale(item.slaLabel, this.locale.locale()) : null;
  }

  chipLabel(chip: ActivityMetaChip): string {
    return pickLocale(chip.label, this.locale.locale());
  }

  severityLabel(severity: ActivitySeverity): string {
    const map: Record<ActivitySeverity, LocalizedPair> = {
      critical: { ar: 'حرج', en: 'Critical' },
      warning: { ar: 'تحذير', en: 'Warning' },
      info: { ar: 'معلومة', en: 'Info' },
      success: { ar: 'مكتمل', en: 'Done' },
    };
    return this.locale.isRtl() ? map[severity].ar : map[severity].en;
  }

  timelineTitleText(item: ActivityTimelineItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  timelineDetail(item: ActivityTimelineItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  timelineTime(item: ActivityTimelineItem): string {
    return pickLocale(item.time, this.locale.locale());
  }

  linkLabel(link: ActivityQuickLink): string {
    return pickLocale(link.label, this.locale.locale());
  }

  linkHint(link: ActivityQuickLink): string {
    return pickLocale(link.hint, this.locale.locale());
  }

  setFilter(filter: ActivityFilter): void {
    this.facade.setFilter(filter);
  }

  goToPage(page: number): void {
    this.facade.goToPage(page);
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  prevPage(): void {
    this.facade.prevPage();
  }
}

interface LocalizedPair {
  ar: string;
  en: string;
}
