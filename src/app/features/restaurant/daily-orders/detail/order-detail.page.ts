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
  lucideCheck,
  lucideChefHat,
  lucideClipboardList,
  lucideClock,
  lucideFlame,
  lucideLayers,
  lucidePackage,
  lucidePrinter,
  lucideScanBarcode,
  lucideShield,
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
  BoxSlotSummary,
  OrderDetailAction,
  OrderDetailChecklistItem,
  OrderDetailFact,
  OrderDetailTimelineItem,
} from './models/order-detail.model';
import { OrderDetailSkeletonComponent } from './order-detail-skeleton.component';

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
      lucideClipboardList,
      lucideClock,
      lucideFlame,
      lucideLayers,
      lucidePackage,
      lucidePrinter,
      lucideScanBarcode,
      lucideShield,
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

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للطلبات اليومية' : 'Back to daily orders',
  );

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly mealTitle = computed(() =>
    this.locale.isRtl() ? 'محتوى البوكس حسب الباقة' : 'Box contents by package',
  );

  readonly mealSubtitle = computed(() => {
    const data = this.facade.data();
    if (!data) return '';
    return this.locale.isRtl()
      ? `${pickLocale(data.bundleLabel, this.locale.locale())} · ${pickLocale(data.boxCompositionLabel, this.locale.locale())}`
      : `${pickLocale(data.bundleLabel, this.locale.locale())} · ${pickLocale(data.boxCompositionLabel, this.locale.locale())}`;
  });

  readonly ingredientsTitle = computed(() =>
    this.locale.isRtl() ? 'المكونات' : 'Ingredients',
  );

  readonly checklistTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة الجاهزية' : 'Readiness checklist',
  );

  readonly timelineTitle = computed(() =>
    this.locale.isRtl() ? 'الخط الزمني' : 'Timeline',
  );

  readonly actionsTitle = computed(() =>
    this.locale.isRtl() ? 'إجراءات سريعة' : 'Quick actions',
  );

  readonly metaTitle = computed(() =>
    this.locale.isRtl() ? 'بيانات التشغيل' : 'Ops metadata',
  );

  readonly slotsTitle = computed(() =>
    this.locale.isRtl() ? 'خانات الباقة' : 'Package slots',
  );

  ngOnInit(): void {
    const sub = this.route.paramMap.subscribe((params) => {
      const code = params.get('orderCode') ?? '';
      this.facade.load(code);
    });
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      this.facade.reset();
    });
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

  factLabel(fact: OrderDetailFact): string {
    return pickLocale(fact.label, this.locale.locale());
  }

  factValue(fact: OrderDetailFact): string {
    return pickLocale(fact.value, this.locale.locale());
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

  allergyLabel(flag: { ar: string; en: string }): string {
    return pickLocale(flag, this.locale.locale());
  }

  checkLabel(item: OrderDetailChecklistItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  checkHint(item: OrderDetailChecklistItem): string {
    return pickLocale(item.hint, this.locale.locale());
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

  actionLabel(action: OrderDetailAction): string {
    return pickLocale(action.label, this.locale.locale());
  }
}
