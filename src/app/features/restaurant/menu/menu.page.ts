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
  lucideEye,
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
  RestaurantWorkspaceFiltersComponent,
  RestaurantWorkspaceHeaderComponent,
  RestaurantWorkspacePanelComponent,
  RestaurantWorkspaceStatComponent,
  RestaurantWorkspaceStatsComponent,
  RestaurantWorkspaceToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-workspace-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { MenuFacade } from './data/menu.facade';
import { MenuSkeletonComponent } from './menu-skeleton.component';
import {
  MenuFilter,
  MenuMealItem,
  MenuMealStatus,
  MenuProgramFilter,
  MenuSlotFilter,
  MenuSummary,
} from './models/menu.model';

@Component({
  selector: 'mm-menu-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    MenuSkeletonComponent,
    RestaurantWorkspaceHeaderComponent,
    RestaurantWorkspaceStatsComponent,
    RestaurantWorkspaceStatComponent,
    RestaurantWorkspaceToolbarComponent,
    RestaurantWorkspaceFiltersComponent,
    RestaurantWorkspacePanelComponent,
  ],
  templateUrl: './menu.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-mn-page block' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCookingPot,
      lucideEye,
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
export class MenuPageComponent implements OnInit {
  readonly facade = inject(MenuFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filters: Array<{
    id: MenuFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'نشطة', labelEn: 'Active' },
    { id: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
    { id: 'paused', labelAr: 'موقوفة', labelEn: 'Paused' },
  ];

  readonly slots: Array<{
    id: MenuSlotFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الفئات', labelEn: 'All slots' },
    { id: 'breakfast', labelAr: 'إفطار', labelEn: 'Breakfast' },
    { id: 'main', labelAr: 'رئيسية', labelEn: 'Main' },
    { id: 'snack', labelAr: 'سناك', labelEn: 'Snack' },
    { id: 'salad', labelAr: 'سلطة', labelEn: 'Salad' },
    { id: 'juice', labelAr: 'عصير', labelEn: 'Juice' },
  ];

  readonly programs: Array<{
    id: MenuProgramFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل البرامج', labelEn: 'All programs' },
    { id: 'fitness', labelAr: 'لياقة', labelEn: 'Fitness' },
    { id: 'slim', labelAr: 'رشاقة', labelEn: 'Slim' },
    { id: 'muscle', labelAr: 'عضلات', labelEn: 'Muscle' },
    { id: 'balance', labelAr: 'توازن', labelEn: 'Balance' },
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

  readonly ingredientsLinkLabel = computed(() => {
    const data = this.facade.data();
    return data
      ? pickLocale(data.ingredientsLinkLabel, this.locale.locale())
      : '';
  });

  readonly ingredientsRoute = computed(
    () => this.facade.data()?.ingredientsRoute ?? '/restaurant/operations/ingredients',
  );

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'كتالوج الوجبات' : 'Meal catalog',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'فعّل أو أوقف الوجبة · البيانات الغذائية ومسببات الحساسية ظاهرة'
      : 'Activate or pause meals · nutrition and allergens visible',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث باسم الوجبة أو البرنامج أو الحساسية'
      : 'Search by meal, program, or allergen',
  );

  readonly slotLabel = computed(() =>
    this.locale.isRtl() ? 'الفئة' : 'Slot',
  );

  readonly programLabel = computed(() =>
    this.locale.isRtl() ? 'البرنامج' : 'Program',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد وجبات مطابقة للتصفية الحالية'
      : 'No meals match the current filters',
  );

  readonly pauseLabel = computed(() =>
    this.locale.isRtl() ? 'إيقاف' : 'Pause',
  );

  readonly activateLabel = computed(() =>
    this.locale.isRtl() ? 'تفعيل' : 'Activate',
  );

  readonly draftLockedLabel = computed(() =>
    this.locale.isRtl() ? 'بانتظار الاعتماد' : 'Awaiting approval',
  );

  readonly createLabel = computed(() =>
    this.locale.isRtl() ? 'إنشاء وجبة' : 'Create meal',
  );

  readonly openLabel = computed(() =>
    this.locale.isRtl() ? 'تفاصيل' : 'Details',
  );

  readonly ingredientsUnit = computed(() =>
    this.locale.isRtl() ? 'مكوّنات' : 'ingredients',
  );

  readonly kcalUnit = computed(() =>
    this.locale.isRtl() ? 'سعرة' : 'kcal',
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

  filterCount(id: MenuFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: MenuSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: MenuSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealRoute(meal: MenuMealItem): string {
    return meal.route ?? `/restaurant/operations/menu/${meal.id}`;
  }

  mealName(meal: MenuMealItem): string {
    return pickLocale(meal.name, this.locale.locale());
  }

  mealDescription(meal: MenuMealItem): string {
    return pickLocale(meal.description, this.locale.locale());
  }

  mealSlot(meal: MenuMealItem): string {
    return pickLocale(meal.slotLabel, this.locale.locale());
  }

  mealProgram(meal: MenuMealItem): string {
    return pickLocale(meal.programLabel, this.locale.locale());
  }

  mealBundle(meal: MenuMealItem): string {
    return pickLocale(meal.bundleLabel, this.locale.locale());
  }

  mealPrep(meal: MenuMealItem): string {
    return pickLocale(meal.prepNote, this.locale.locale());
  }

  mealUpdated(meal: MenuMealItem): string {
    return pickLocale(meal.updatedAtLabel, this.locale.locale());
  }

  allergenLabel(flag: { ar: string; en: string }): string {
    return pickLocale(flag, this.locale.locale());
  }

  statusLabel(status: MenuMealStatus): string {
    const map: Record<MenuMealStatus, { ar: string; en: string }> = {
      active: { ar: 'نشطة', en: 'Active' },
      draft: { ar: 'مسودة', en: 'Draft' },
      paused: { ar: 'موقوفة', en: 'Paused' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  toggleLabel(meal: MenuMealItem): string {
    if (meal.status === 'active') return this.pauseLabel();
    if (meal.status === 'paused') return this.activateLabel();
    return this.draftLockedLabel();
  }

  setFilter(filter: MenuFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onSlotChange(value: string): void {
    this.facade.setSlot(value as MenuSlotFilter);
  }

  onProgramChange(value: string): void {
    this.facade.setProgram(value as MenuProgramFilter);
  }

  toggleMeal(meal: MenuMealItem): void {
    this.facade.toggleAvailability(meal.id);
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
