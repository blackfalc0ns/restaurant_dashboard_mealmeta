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
  lucideCheck,
  lucideChevronLeft,
  lucideChevronRight,
  lucideCookingPot,
  lucideFilePen,
  lucidePause,
  lucidePlay,
  lucidePlus,
  lucideSearch,
  lucideTriangleAlert,
  lucideUtensilsCrossed,
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
import { IngredientsFacade } from './data/ingredients.facade';
import { IngredientsSkeletonComponent } from './ingredients-skeleton.component';
import {
  IngredientCategoryFilter,
  IngredientFilter,
  IngredientItem,
  IngredientStatus,
  IngredientSummary,
} from './models/ingredient.model';

@Component({
  selector: 'mm-ingredients-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    IngredientsSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './ingredients.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ig-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCookingPot,
      lucideFilePen,
      lucidePause,
      lucidePlay,
      lucidePlus,
      lucideSearch,
      lucideTriangleAlert,
      lucideUtensilsCrossed,
    }),
  ],
})
export class IngredientsPageComponent implements OnInit {
  readonly facade = inject(IngredientsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: IngredientFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'نشطة', labelEn: 'Active' },
    { id: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
    { id: 'paused', labelAr: 'موقوفة', labelEn: 'Paused' },
  ];

  readonly categories: Array<{
    id: IngredientCategoryFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الفئات', labelEn: 'All categories' },
    { id: 'poultry', labelAr: 'دواجن / لحوم', labelEn: 'Poultry / meat' },
    { id: 'seafood', labelAr: 'مأكولات بحرية', labelEn: 'Seafood' },
    { id: 'dairy', labelAr: 'ألبان وبيض', labelEn: 'Dairy & eggs' },
    { id: 'produce', labelAr: 'خضار وفواكه', labelEn: 'Produce' },
    { id: 'grains', labelAr: 'حبوب', labelEn: 'Grains' },
    { id: 'other', labelAr: 'أخرى', labelEn: 'Other' },
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

  readonly menuLinkLabel = computed(() => {
    const data = this.facade.data();
    return data
      ? pickLocale(data.menuLinkLabel, this.locale.locale())
      : '';
  });

  readonly createLabel = computed(() =>
    this.locale.isRtl() ? 'إنشاء مكوّن' : 'Create ingredient',
  );

  readonly menuRoute = computed(
    () => this.facade.data()?.menuRoute ?? '/restaurant/operations/menu',
  );

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'كتالوج المكوّنات' : 'Ingredient catalog',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'القيم لكل 100 جم · فعّل أو أوقف المكوّن'
      : 'Values per 100g · activate or pause ingredients',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث باسم المكوّن أو الفئة أو الحساسية'
      : 'Search by name, category, or allergen',
  );

  readonly categoryLabel = computed(() =>
    this.locale.isRtl() ? 'الفئة' : 'Category',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد مكوّنات مطابقة للتصفية الحالية'
      : 'No ingredients match the current filters',
  );

  readonly draftLockedLabel = computed(() =>
    this.locale.isRtl() ? 'بانتظار الاعتماد' : 'Awaiting approval',
  );

  readonly pauseLabel = computed(() =>
    this.locale.isRtl() ? 'إيقاف' : 'Pause',
  );

  readonly activateLabel = computed(() =>
    this.locale.isRtl() ? 'تفعيل' : 'Activate',
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

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: IngredientFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: IngredientSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: IngredientSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  itemName(item: IngredientItem): string {
    return pickLocale(item.name, this.locale.locale());
  }

  itemCategory(item: IngredientItem): string {
    return pickLocale(item.categoryLabel, this.locale.locale());
  }

  itemUpdated(item: IngredientItem): string {
    return pickLocale(item.updatedAtLabel, this.locale.locale());
  }

  allergenLabel(flag: { ar: string; en: string }): string {
    return pickLocale(flag, this.locale.locale());
  }

  statusLabel(status: IngredientStatus): string {
    const map: Record<IngredientStatus, { ar: string; en: string }> = {
      active: { ar: 'نشط', en: 'Active' },
      draft: { ar: 'مسودة', en: 'Draft' },
      paused: { ar: 'موقوف', en: 'Paused' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  toggleLabel(item: IngredientItem): string {
    if (item.status === 'active') return this.pauseLabel();
    if (item.status === 'paused') return this.activateLabel();
    return this.draftLockedLabel();
  }

  usageLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} وجبة`
      : `${count} meal${count === 1 ? '' : 's'}`;
  }

  setFilter(filter: IngredientFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onCategoryChange(value: string): void {
    this.facade.setCategory(value as IngredientCategoryFilter);
  }

  toggleItem(item: IngredientItem): void {
    this.facade.toggleAvailability(item.id);
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
