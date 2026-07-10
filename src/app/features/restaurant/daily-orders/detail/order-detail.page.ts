import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideChefHat,
  lucideChevronDown,
  lucideCircle,
  lucideCircleDashed,
  lucideClipboardList,
  lucideClock,
  lucideInfo,
  lucidePackage,
  lucidePrinter,
  lucideScanBarcode,
  lucideTimer,
  lucideTriangleAlert,
  lucideTruck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../../overview/overview-i18n';
import { DailyOrderStatus } from '../models/daily-orders.model';
import { OrderDetailFacade } from './data/order-detail.facade';
import {
  BoxMealIngredient,
  BoxMealItem,
  BoxMealSlot,
  BoxSlotSummary,
  OrderDetailAction,
  OrderDetailChecklistItem,
  OrderDetailTimelineItem,
} from './models/order-detail.model';
import { OrderDetailSkeletonComponent } from './order-detail-skeleton.component';

type MealTab = 'all' | BoxMealSlot;

@Component({
  selector: 'mm-order-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    OrderDetailSkeletonComponent,
  ],
  templateUrl: './order-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-od-page block' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideChefHat,
      lucideChevronDown,
      lucideCircle,
      lucideCircleDashed,
      lucideClipboardList,
      lucideClock,
      lucideInfo,
      lucidePackage,
      lucidePrinter,
      lucideScanBarcode,
      lucideTimer,
      lucideTriangleAlert,
      lucideTruck,
    }),
  ],
})
export class OrderDetailPageComponent implements OnInit {
  readonly facade = inject(OrderDetailFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeTab = signal<MealTab>('all');
  readonly openMealId = signal<string | null>(null);
  readonly openIngredientId = signal<string | null>(null);

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للطلبات اليومية' : 'Back to daily orders',
  );

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly mealTitle = computed(() =>
    this.locale.isRtl() ? 'وجبات البوكس' : 'Box meals',
  );

  readonly ingredientsTitle = computed(() =>
    this.locale.isRtl() ? 'المكونات بالتفصيل' : 'Ingredients in detail',
  );

  readonly nutritionTitle = computed(() =>
    this.locale.isRtl() ? 'القيم الغذائية' : 'Nutrition facts',
  );

  readonly checklistTitle = computed(() =>
    this.locale.isRtl() ? 'الجاهزية' : 'Readiness',
  );

  readonly checklistDone = computed(
    () => this.facade.data()?.checklist.filter((item) => item.done).length ?? 0,
  );

  readonly checklistTotal = computed(
    () => this.facade.data()?.checklist.length ?? 0,
  );

  readonly checklistPercent = computed(() => {
    const total = this.checklistTotal();
    if (!total) return 0;
    return Math.round((this.checklistDone() / total) * 100);
  });

  readonly checklistState = computed(() => {
    const done = this.checklistDone();
    const total = this.checklistTotal();
    if (!total) return 'empty';
    if (done >= total) return 'ready';
    if (done === 0) return 'pending';
    return 'progress';
  });

  readonly checklistSubtitle = computed(() => {
    const state = this.checklistState();
    const rtl = this.locale.isRtl();
    if (state === 'ready') {
      return rtl ? 'كل خطوات الجاهزية مكتملة' : 'All readiness steps complete';
    }
    if (state === 'pending') {
      return rtl ? 'لم تبدأ خطوات التجهيز بعد' : 'Prep steps have not started';
    }
    return rtl
      ? `${this.checklistDone()} من ${this.checklistTotal()} خطوات مكتملة`
      : `${this.checklistDone()} of ${this.checklistTotal()} steps done`;
  });

  readonly nextCheckId = computed(() => {
    const items = this.facade.data()?.checklist ?? [];
    return items.find((item) => !item.done)?.id ?? null;
  });

  readonly timelineTitle = computed(() =>
    this.locale.isRtl() ? 'الخط الزمني' : 'Timeline',
  );

  readonly timelineCount = computed(
    () => this.facade.data()?.timeline.length ?? 0,
  );

  readonly timelineSubtitle = computed(() => {
    const count = this.timelineCount();
    const rtl = this.locale.isRtl();
    if (!count) {
      return rtl ? 'لا أحداث بعد' : 'No events yet';
    }
    return rtl
      ? `${count} أحداث تشغيلية للطلب`
      : `${count} operational events for this order`;
  });

  readonly actionsTitle = computed(() =>
    this.locale.isRtl() ? 'إجراءات' : 'Actions',
  );

  readonly metaTitle = computed(() =>
    this.locale.isRtl() ? 'ملخص الطلب' : 'Order summary',
  );

  readonly tabs = computed(() => {
    const data = this.facade.data();
    const all = {
      id: 'all' as MealTab,
      label: this.locale.isRtl() ? 'الكل' : 'All',
      count: data?.meals.length ?? 0,
    };
    if (!data) return [all];

    const slotTabs = data.slotSummary.map((slot) => ({
      id: slot.slot as MealTab,
      label: pickLocale(slot.label, this.locale.locale()),
      count: data.meals.filter((meal) => meal.slot === slot.slot).length,
    }));

    return [all, ...slotTabs];
  });

  readonly filteredMeals = computed(() => {
    const data = this.facade.data();
    if (!data) return [];
    const tab = this.activeTab();
    if (tab === 'all') return data.meals;
    return data.meals.filter((meal) => meal.slot === tab);
  });

  ngOnInit(): void {
    const sub = this.route.paramMap.subscribe((params) => {
      const code = params.get('orderCode') ?? '';
      this.activeTab.set('all');
      this.openMealId.set(null);
      this.openIngredientId.set(null);
      this.facade.load(code);
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      this.facade.reset();
    });
  }

  setTab(tab: MealTab): void {
    this.activeTab.set(tab);
    this.openMealId.set(null);
    this.openIngredientId.set(null);
  }

  toggleMeal(id: string): void {
    this.openMealId.update((current) => (current === id ? null : id));
    this.openIngredientId.set(null);
  }

  toggleIngredient(id: string): void {
    this.openIngredientId.update((current) => (current === id ? null : id));
  }

  isOpen(id: string): boolean {
    return this.openMealId() === id;
  }

  isIngredientOpen(id: string): boolean {
    return this.openIngredientId() === id;
  }

  statusLabel(status: DailyOrderStatus): string {
    const map: Record<DailyOrderStatus, { ar: string; en: string }> = {
      preparing: { ar: 'قيد التحضير', en: 'Preparing' },
      ready: { ar: 'جاهز', en: 'Ready' },
      'waiting-driver': { ar: 'مع السائق', en: 'With driver' },
      completed: { ar: 'مكتمل', en: 'Completed' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  text(value: { ar: string; en: string }): string {
    return pickLocale(value, this.locale.locale());
  }

  slotLabel(slot: BoxSlotSummary): string {
    return pickLocale(slot.label, this.locale.locale());
  }

  mealName(meal: BoxMealItem): string {
    return pickLocale(meal.name, this.locale.locale());
  }

  mealSlot(meal: BoxMealItem): string {
    return pickLocale(meal.slotLabel, this.locale.locale());
  }

  mealDescription(meal: BoxMealItem): string {
    return pickLocale(meal.description, this.locale.locale());
  }

  mealPrep(meal: BoxMealItem): string {
    return pickLocale(meal.prepNote, this.locale.locale());
  }

  ingredientName(item: BoxMealIngredient): string {
    return pickLocale(item.name, this.locale.locale());
  }

  ingredientAmount(item: BoxMealIngredient): string {
    return pickLocale(item.amount, this.locale.locale());
  }

  ingredientNote(item: BoxMealIngredient): string | null {
    return item.note ? pickLocale(item.note, this.locale.locale()) : null;
  }

  ingredientPrep(item: BoxMealIngredient): string {
    return pickLocale(item.prepStyle, this.locale.locale());
  }

  allergyLabel(flag: { ar: string; en: string }): string {
    return pickLocale(flag, this.locale.locale());
  }

  checkLabel(item: OrderDetailChecklistItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  checkHint(item: OrderDetailChecklistItem): string {
    return pickLocale(item.hint, this.locale.locale());
  }

  isCurrentCheck(item: OrderDetailChecklistItem): boolean {
    return !item.done && item.id === this.nextCheckId();
  }

  checkStateLabel(item: OrderDetailChecklistItem): string {
    if (item.done) {
      return this.locale.isRtl() ? 'تم' : 'Done';
    }
    if (this.isCurrentCheck(item)) {
      return this.locale.isRtl() ? 'التالي' : 'Next';
    }
    return this.locale.isRtl() ? 'قادم' : 'Upcoming';
  }

  timelineTitleText(item: OrderDetailTimelineItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  timelineDetail(item: OrderDetailTimelineItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  timelineTime(item: OrderDetailTimelineItem): string {
    return pickLocale(item.time, this.locale.locale());
  }

  timelineIcon(item: OrderDetailTimelineItem): string {
    const map: Record<OrderDetailTimelineItem['tone'], string> = {
      success: 'lucideCheck',
      warning: 'lucideTriangleAlert',
      critical: 'lucideTriangleAlert',
      info: 'lucideInfo',
    };
    return map[item.tone];
  }

  timelineToneLabel(item: OrderDetailTimelineItem): string {
    const map: Record<OrderDetailTimelineItem['tone'], { ar: string; en: string }> = {
      success: { ar: 'نجاح', en: 'Success' },
      warning: { ar: 'تنبيه', en: 'Warning' },
      critical: { ar: 'حرج', en: 'Critical' },
      info: { ar: 'معلومة', en: 'Info' },
    };
    return this.locale.isRtl() ? map[item.tone].ar : map[item.tone].en;
  }

  actionLabel(action: OrderDetailAction): string {
    return pickLocale(action.label, this.locale.locale());
  }
}
