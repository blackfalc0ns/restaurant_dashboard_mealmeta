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
  lucideCircle,
  lucideClipboardList,
  lucideExternalLink,
  lucideMapPin,
  lucidePackage,
  lucidePrinter,
  lucideScanBarcode,
  lucideTruck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../../overview/overview-i18n';
import { HandoverDetailFacade } from '../data/handover-detail.facade';
import {
  HandoverBoxScan,
  HandoverChecklistItem,
  HandoverFact,
  HandoverMealItem,
  HandoverStatus,
  HandoverTimelineItem,
} from '../models/handover.model';
import { HandoverDetailSkeletonComponent } from './handover-detail-skeleton.component';

@Component({
  selector: 'mm-handover-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    PageStateComponent,
    HandoverDetailSkeletonComponent,
  ],
  templateUrl: './handover-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-hod-page block' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideCircle,
      lucideClipboardList,
      lucideExternalLink,
      lucideMapPin,
      lucidePackage,
      lucidePrinter,
      lucideScanBarcode,
      lucideTruck,
    }),
  ],
})
export class HandoverDetailPageComponent implements OnInit {
  readonly facade = inject(HandoverDetailFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للتسليم' : 'Back to handover',
  );

  readonly boxesTitle = computed(() =>
    this.locale.isRtl() ? 'البوكسات والوجبات' : 'Boxes & meals',
  );

  readonly timelineTitle = computed(() =>
    this.locale.isRtl() ? 'مسار التسليم' : 'Handover timeline',
  );

  readonly driverTitle = computed(() =>
    this.locale.isRtl() ? 'المندوب' : 'Driver',
  );

  readonly factsTitle = computed(() =>
    this.locale.isRtl() ? 'بيانات الطلب' : 'Order facts',
  );

  readonly checklistTitle = computed(() =>
    this.locale.isRtl() ? 'جاهزية التسليم' : 'Handover checklist',
  );

  readonly pickupScanLabel = computed(() =>
    this.locale.isRtl() ? 'استلام' : 'Pickup',
  );

  readonly deliveryScanLabel = computed(() =>
    this.locale.isRtl() ? 'تسليم' : 'Delivery',
  );

  readonly confirmPickupLabel = computed(() =>
    this.locale.isRtl() ? 'تأكيد استلام المندوب' : 'Confirm driver pickup',
  );

  readonly labelsLabel = computed(() =>
    this.locale.isRtl() ? 'الملصقات' : 'Labels',
  );

  readonly orderDetailLabel = computed(() =>
    this.locale.isRtl() ? 'تفاصيل الطلب' : 'Order detail',
  );

  readonly mealsUnit = computed(() =>
    this.locale.isRtl() ? 'وجبات' : 'meals',
  );

  readonly pendingScanLabel = computed(() =>
    this.locale.isRtl() ? 'بانتظار المسح' : 'Awaiting scan',
  );

  readonly invoiceLabel = computed(() =>
    this.locale.isRtl() ? 'فاتورة' : 'Invoice',
  );

  readonly mealsInBoxLabel = computed(() =>
    this.locale.isRtl() ? 'محتوى البوكس' : 'Box contents',
  );

  readonly kcalUnit = computed(() =>
    this.locale.isRtl() ? 'سعرة' : 'kcal',
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

  text(value: { ar: string; en: string }): string {
    return pickLocale(value, this.locale.locale());
  }

  statusLabel(status: HandoverStatus): string {
    const map: Record<HandoverStatus, { ar: string; en: string }> = {
      'awaiting-pickup': { ar: 'بانتظار الاستلام', en: 'Awaiting pickup' },
      'en-route': { ar: 'مع المندوب', en: 'With driver' },
      delivered: { ar: 'تم التسليم', en: 'Delivered' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  boxLabel(box: HandoverBoxScan): string {
    return pickLocale(box.boxLabel, this.locale.locale());
  }

  boxPickupAt(box: HandoverBoxScan): string {
    return box.pickupAtLabel
      ? pickLocale(box.pickupAtLabel, this.locale.locale())
      : this.pendingScanLabel();
  }

  boxDeliveryAt(box: HandoverBoxScan): string {
    return box.deliveryAtLabel
      ? pickLocale(box.deliveryAtLabel, this.locale.locale())
      : this.pendingScanLabel();
  }

  mealSlot(meal: HandoverMealItem): string {
    return pickLocale(meal.slotLabel, this.locale.locale());
  }

  mealName(meal: HandoverMealItem): string {
    return pickLocale(meal.mealName, this.locale.locale());
  }

  mealAllergen(meal: HandoverMealItem): string | null {
    return meal.allergenNote
      ? pickLocale(meal.allergenNote, this.locale.locale())
      : null;
  }

  factLabel(fact: HandoverFact): string {
    return pickLocale(fact.label, this.locale.locale());
  }

  factValue(fact: HandoverFact): string {
    return pickLocale(fact.value, this.locale.locale());
  }

  checkLabel(item: HandoverChecklistItem): string {
    return pickLocale(item.label, this.locale.locale());
  }

  checkHint(item: HandoverChecklistItem): string {
    return pickLocale(item.hint, this.locale.locale());
  }

  timelineTitleText(item: HandoverTimelineItem): string {
    return pickLocale(item.title, this.locale.locale());
  }

  timelineDetail(item: HandoverTimelineItem): string {
    return pickLocale(item.detail, this.locale.locale());
  }

  timelineTime(item: HandoverTimelineItem): string {
    return pickLocale(item.time, this.locale.locale());
  }

  confirmPickup(): void {
    this.facade.confirmPickup();
  }
}
