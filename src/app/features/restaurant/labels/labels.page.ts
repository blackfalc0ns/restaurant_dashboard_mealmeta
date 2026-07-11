import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronLeft,
  lucideChevronRight,
  lucidePrinter,
  lucideQrCode,
  lucideScanBarcode,
  lucideSearch,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../overview/overview-i18n';
import { LabelsFacade } from './data/labels.facade';
import { LabelsSkeletonComponent } from './labels-skeleton.component';
import {
  BoxInvoice,
  LabelJobItem,
  LabelPrintStatus,
  LabelsFilter,
  LabelsShift,
  LabelsSummary,
  MealLabelSticker,
  OrderBoxPack,
} from './models/labels.model';
import { buildQrMatrix } from './utils/qr-matrix';

@Component({
  selector: 'mm-labels-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    LabelsSkeletonComponent,
  ],
  templateUrl: './labels.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-lb-page block' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronLeft,
      lucideChevronRight,
      lucidePrinter,
      lucideQrCode,
      lucideScanBarcode,
      lucideSearch,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class LabelsPageComponent implements OnInit {
  readonly facade = inject(LabelsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly previewOpen = signal(false);

  readonly filters: Array<{
    id: LabelsFilter;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
    { id: 'printed', labelAr: 'مطبوع', labelEn: 'Printed' },
    { id: 'missing', labelAr: 'ينقص باركود', labelEn: 'Missing' },
  ];

  readonly shifts: Array<{
    id: LabelsShift;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'all', labelAr: 'كل الورديات', labelEn: 'All shifts' },
    { id: 'morning', labelAr: 'صباح', labelEn: 'Morning' },
    { id: 'noon', labelAr: 'ظهيرة', labelEn: 'Noon' },
    { id: 'evening', labelAr: 'مساء', labelEn: 'Evening' },
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

  readonly printAllLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.printAllLabel, this.locale.locale()) : '';
  });

  readonly listTitle = computed(() =>
    this.locale.isRtl() ? 'قائمة الطباعة' : 'Print queue',
  );

  readonly previewTitle = computed(() =>
    this.locale.isRtl()
      ? 'معاينة الفواتير والملصقات'
      : 'Invoice & label preview',
  );

  readonly previewEmpty = computed(() =>
    this.locale.isRtl()
      ? 'اختر طلبًا جاهزًا لمعاينة فواتيره وملصقاته'
      : 'Select a ready job to preview invoices & labels',
  );

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'فاتورة QR لكل بوكس · ملصق لكل وجبة · بدون بيانات عميل'
      : 'QR invoice per box · label per meal · no customer PII',
  );

  readonly invoiceTitle = computed(() =>
    this.locale.isRtl() ? 'فاتورة البوكس' : 'Box invoice',
  );

  readonly mealsTitle = computed(() =>
    this.locale.isRtl() ? 'ملصقات الوجبات' : 'Meal labels',
  );

  readonly mealsCountLabel = computed(() =>
    this.locale.isRtl() ? 'وجبات' : 'meals',
  );

  readonly closeLabel = computed(() =>
    this.locale.isRtl() ? 'إغلاق' : 'Close',
  );

  readonly previewLabel = computed(() =>
    this.locale.isRtl() ? 'معاينة' : 'Preview',
  );

  readonly brandMark = computed(() => 'MealMate');

  readonly caloriesUnit = computed(() =>
    this.locale.isRtl() ? 'سعرة' : 'kcal',
  );

  readonly proteinUnit = computed(() =>
    this.locale.isRtl() ? 'بروتين' : 'protein',
  );

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'بحث برقم الطلب أو الباركود أو الدفعة'
      : 'Search by order, barcode, or batch',
  );

  readonly shiftLabel = computed(() =>
    this.locale.isRtl() ? 'الوردية' : 'Shift',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا توجد ملصقات مطابقة للتصفية الحالية'
      : 'No labels match the current filters',
  );

  readonly printLabel = computed(() =>
    this.locale.isRtl() ? 'طباعة' : 'Print',
  );

  readonly printedLabel = computed(() =>
    this.locale.isRtl() ? 'مطبوع' : 'Printed',
  );

  readonly detailsLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );

  readonly missingBarcodeLabel = computed(() =>
    this.locale.isRtl() ? 'غير جاهز' : 'Not ready',
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

  filterCount(id: LabelsFilter): number {
    return this.facade.filterCounts()[id];
  }

  summaryLabel(card: LabelsSummary): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryHint(card: LabelsSummary): string {
    return pickLocale(card.hint, this.locale.locale());
  }

  mealLabel(job: LabelJobItem): string {
    return pickLocale(job.mealLabel, this.locale.locale());
  }

  slotLabel(job: LabelJobItem): string {
    return pickLocale(job.slotLabel, this.locale.locale());
  }

  programLabel(job: LabelJobItem): string {
    return pickLocale(job.programLabel, this.locale.locale());
  }

  shiftText(job: LabelJobItem): string {
    return pickLocale(job.shiftLabel, this.locale.locale());
  }

  deliverySlot(job: LabelJobItem): string {
    return pickLocale(job.deliverySlotLabel, this.locale.locale());
  }

  printedAt(job: LabelJobItem): string {
    return job.printedAtLabel
      ? pickLocale(job.printedAtLabel, this.locale.locale())
      : '';
  }

  deliveryDate(job: LabelJobItem): string {
    return pickLocale(job.deliveryDateLabel, this.locale.locale());
  }

  boxLabel(box: OrderBoxPack): string {
    return pickLocale(box.boxLabel, this.locale.locale());
  }

  invoiceAmount(invoice: BoxInvoice): string {
    return pickLocale(invoice.amountLabel, this.locale.locale());
  }

  invoiceScanHint(invoice: BoxInvoice): string {
    return pickLocale(invoice.scanHint, this.locale.locale());
  }

  stickerSlot(sticker: MealLabelSticker): string {
    return pickLocale(sticker.slotLabel, this.locale.locale());
  }

  stickerMeal(sticker: MealLabelSticker): string {
    return pickLocale(sticker.mealName, this.locale.locale());
  }

  stickerAllergen(sticker: MealLabelSticker): string | null {
    return sticker.allergenNote
      ? pickLocale(sticker.allergenNote, this.locale.locale())
      : null;
  }

  qrMatrix(payload: string): boolean[][] {
    return buildQrMatrix(payload, 21);
  }

  barcodeBars(code: string): number[] {
    const bars: number[] = [];
    for (let i = 0; i < code.length; i += 1) {
      const n = code.charCodeAt(i);
      bars.push(1 + (n % 3), 1 + ((n >> 2) % 2), 2 + (n % 2));
    }
    return bars.slice(0, 28);
  }

  statusLabel(status: LabelPrintStatus): string {
    const map: Record<LabelPrintStatus, { ar: string; en: string }> = {
      ready: { ar: 'جاهز للطباعة', en: 'Ready to print' },
      printed: { ar: 'مطبوع', en: 'Printed' },
      missing: { ar: 'ينقص باركود', en: 'Missing barcode' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  boxesLabel(count: number): string {
    return this.locale.isRtl()
      ? `${count} بوكس`
      : `${count} box${count === 1 ? '' : 'es'}`;
  }

  setFilter(filter: LabelsFilter): void {
    this.facade.setFilter(filter);
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  onShiftChange(value: string): void {
    this.facade.setShift(value as LabelsShift);
  }

  print(job: LabelJobItem): void {
    this.facade.printJob(job.id);
  }

  preview(job: LabelJobItem): void {
    if (!job.boxes.length) return;
    this.facade.selectJob(job.id);
    this.previewOpen.set(true);
  }

  closePreview(): void {
    this.previewOpen.set(false);
    this.facade.clearSelectedJob();
  }

  printBatch(): void {
    this.facade.printReadyBatch();
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
