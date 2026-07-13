import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideClock3,
  lucideCookingPot,
  lucideDumbbell,
  lucidePackage,
  lucidePause,
  lucidePlay,
  lucideScale,
  lucideTriangleAlert,
  lucideUtensilsCrossed,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../../overview/overview-i18n';
import { MenuDetailFacade } from '../data/menu-detail.facade';
import {
  MenuDetailFact,
  MenuDetailIngredient,
} from '../models/menu-detail.model';
import { MenuMealStatus } from '../models/menu.model';
import { MenuDetailSkeletonComponent } from './menu-detail-skeleton.component';

@Component({
  selector: 'mm-menu-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    MenuDetailSkeletonComponent,
  ],
  templateUrl: './menu-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-mnd-page block' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideClock3,
      lucideCookingPot,
      lucideDumbbell,
      lucidePackage,
      lucidePause,
      lucidePlay,
      lucideScale,
      lucideTriangleAlert,
      lucideUtensilsCrossed,
    }),
  ],
})
export class MenuDetailPageComponent implements OnInit {
  readonly facade = inject(MenuDetailFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للقائمة' : 'Back to menu',
  );

  readonly factsTitle = computed(() =>
    this.locale.isRtl() ? 'بيانات الوجبة' : 'Meal facts',
  );

  readonly nutritionTitle = computed(() =>
    this.locale.isRtl() ? 'التغذية' : 'Nutrition',
  );

  readonly ingredientsTitle = computed(() =>
    this.locale.isRtl() ? 'المكوّنات' : 'Ingredients',
  );

  readonly prepTitle = computed(() =>
    this.locale.isRtl() ? 'ملاحظات التحضير' : 'Prep notes',
  );

  readonly ingredientsLinkLabel = computed(() =>
    this.locale.isRtl() ? 'كتالوج المكوّنات' : 'Ingredients catalog',
  );

  readonly draftLockedLabel = computed(() =>
    this.locale.isRtl() ? 'بانتظار الاعتماد' : 'Awaiting approval',
  );

  readonly pauseLabel = computed(() =>
    this.locale.isRtl() ? 'إيقاف التوفر' : 'Pause availability',
  );

  readonly activateLabel = computed(() =>
    this.locale.isRtl() ? 'تفعيل التوفر' : 'Activate availability',
  );

  readonly kcalUnit = computed(() =>
    this.locale.isRtl() ? 'سعرة' : 'kcal',
  );

  ngOnInit(): void {
    const sub = this.route.paramMap.subscribe((params) => {
      const mealId = params.get('mealId') ?? '';
      this.facade.load(mealId);
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      this.facade.reset();
    });
  }

  text(value: { ar: string; en: string }): string {
    return pickLocale(value, this.locale.locale());
  }

  statusLabel(status: MenuMealStatus): string {
    const map: Record<MenuMealStatus, { ar: string; en: string }> = {
      active: { ar: 'نشطة', en: 'Active' },
      draft: { ar: 'مسودة', en: 'Draft' },
      paused: { ar: 'موقوفة', en: 'Paused' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  factLabel(fact: MenuDetailFact): string {
    return pickLocale(fact.label, this.locale.locale());
  }

  factValue(fact: MenuDetailFact): string {
    return pickLocale(fact.value, this.locale.locale());
  }

  ingredientName(item: MenuDetailIngredient): string {
    return pickLocale(item.name, this.locale.locale());
  }

  ingredientAmount(item: MenuDetailIngredient): string {
    return pickLocale(item.amount, this.locale.locale());
  }

  toggleLabel(status: MenuMealStatus): string {
    if (status === 'active') return this.pauseLabel();
    if (status === 'paused') return this.activateLabel();
    return this.draftLockedLabel();
  }

  toggle(): void {
    this.facade.toggleAvailability();
  }
}
