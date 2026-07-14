import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeDollarSign,
  lucideCheck,
  lucideChevronLeft,
  lucideChevronRight,
  lucideFilePen,
  lucideInfo,
  lucideLayers,
  lucidePackage,
  lucidePercent,
  lucideSave,
  lucideSearch,
  lucideTriangleAlert,
  lucideUtensilsCrossed,
  lucideX,
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
import { PricingFacade } from './data/pricing.facade';
import {
  PricingFilter,
  PricingRow,
  PricingRowStatus,
  PricingSummary,
  RestaurantTier,
} from './models/pricing.model';
import { PricingSkeletonComponent } from './pricing-skeleton.component';

@Component({
  selector: 'mm-pricing-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    PricingSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './pricing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-pr-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideBadgeDollarSign,
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideFilePen,
      lucideInfo,
      lucideLayers,
      lucidePackage,
      lucidePercent,
      lucideSave,
      lucideSearch,
      lucideTriangleAlert,
      lucideUtensilsCrossed,
      lucideX,
    }),
  ],
})
export class PricingPageComponent implements OnInit {
  readonly facade = inject(PricingFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: PricingFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'configured', labelAr: 'مسعّرة', labelEn: 'Priced' },
    { id: 'missing', labelAr: 'بدون سعر', labelEn: 'Unpriced' },
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
    return this.locale.isRtl()
      ? 'حدّث سعر البوكس ثم احفظ التغييرات ليُطبق السعر الجديد على الاشتراكات الجديدة فقط'
      : 'Update the box price and save; the new price applies to new subscriptions only';
  });

  readonly menuLinkLabel = computed(() => {
    const data = this.facade.data();
    return data
      ? pickLocale(data.menuLinkLabel, this.locale.locale())
      : '';
  });

  readonly menuRoute = computed(
    () => this.facade.data()?.menuRoute ?? '/restaurant/operations/menu',
  );

  readonly activeSummaries = computed(
    () =>
      (this.facade.data()?.summaries ?? []).filter(
        (card) => card.id !== 'commission',
      ),
  );

  readonly listTitle = computed(() => {
    return this.locale.isRtl() ? 'أسعار البوكسات' : 'Box prices';
  });

  readonly listSubtitle = computed(() => {
    return this.locale.isRtl()
      ? 'راجع أسعار البوكسات وحدّثها من مكان واحد'
      : 'Review and update box prices in one place';
  });

  readonly searchPlaceholder = computed(() => {
    return this.locale.isRtl()
      ? 'بحث عن بوكس (النوع أو الباقة)'
      : 'Search boxes (type or bundle)';
  });

  readonly programLabel = computed(() =>
    this.locale.isRtl() ? 'نوع البوكس' : 'Box type',
  );

  readonly bundleLabel = computed(() =>
    this.locale.isRtl() ? 'الباقة' : 'Bundle',
  );

  readonly emptyLabel = computed(() => {
    return this.locale.isRtl()
      ? 'لا توجد بوكسات مطابقة للتصفية الحالية'
      : 'No boxes match the current filters';
  });

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  readonly saveLabel = computed(() =>
    this.locale.isRtl() ? 'حفظ التغييرات' : 'Save changes',
  );

  readonly discardLabel = computed(() =>
    this.locale.isRtl() ? 'تجاهل' : 'Discard',
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

  readonly dirtyHint = computed(() => {
    const count = this.facade.dirtyCount();
    if (count === 0) {
      return this.locale.isRtl()
        ? 'لا توجد تغييرات غير محفوظة'
        : 'No unsaved changes';
    }
    return this.locale.isRtl()
      ? `${count} تعديل بوكس بانتظار الحفظ · يؤثر على الاشتراكات الجديدة فقط`
      : `${count} box change${count === 1 ? '' : 's'} pending · affects new subscriptions only`;
  });

  readonly listCount = computed(() => this.facade.filteredRows().length);

  ngOnInit(): void {
    this.facade.setScope('boxes');
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: PricingFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: PricingSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: PricingSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  programName(row: PricingRow): string {
    return pickLocale(row.programLabel, this.locale.locale());
  }

  bundleName(row: PricingRow): string {
    return pickLocale(row.bundleLabel, this.locale.locale());
  }

  updatedLabel(row: PricingRow): string {
    return pickLocale(row.updatedAtLabel, this.locale.locale());
  }

  statusLabel(status: PricingRowStatus): string {
    const map: Record<PricingRowStatus, { ar: string; en: string }> = {
      configured: { ar: 'مسعّر', en: 'Priced' },
      missing: { ar: 'بدون سعر', en: 'Unpriced' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  tierLabel(tier: RestaurantTier | null): string {
    if (!tier) return '—';
    const map: Record<RestaurantTier, { ar: string; en: string }> = {
      basic: { ar: 'أساسي', en: 'Basic' },
      platinum: { ar: 'بلاتينيوم', en: 'Platinum' },
      elite: { ar: 'نخبة', en: 'Elite' },
    };
    return this.locale.isRtl() ? map[tier].ar : map[tier].en;
  }

  localizedLabel(label: { ar: string; en: string }): string {
    return pickLocale(label, this.locale.locale());
  }

  setFilter(filter: PricingFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onProgramChange(value: string): void {
    this.facade.setProgram(value);
  }

  onBundleChange(value: string): void {
    this.facade.setBundle(value);
  }

  onPriceInput(rowId: string, value: string): void {
    this.facade.onPriceInput(rowId, value);
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

  save(): void {
    this.facade.saveChanges();
  }

  discard(): void {
    this.facade.discardChanges();
  }
}
