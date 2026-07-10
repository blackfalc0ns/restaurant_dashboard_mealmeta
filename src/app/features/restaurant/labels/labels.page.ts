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
  lucidePrinter,
  lucideQrCode,
  lucideScanBarcode,
  lucideSearch,
  lucideTriangleAlert,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { pickLocale } from '../overview/overview-i18n';
import { LabelsFacade } from './data/labels.facade';
import { LabelsSkeletonComponent } from './labels-skeleton.component';
import {
  LabelJobItem,
  LabelPrintStatus,
  LabelsFilter,
  LabelsShift,
  LabelsSummary,
} from './models/labels.model';

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
    }),
  ],
})
export class LabelsPageComponent implements OnInit {
  readonly facade = inject(LabelsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

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

  readonly listSubtitle = computed(() =>
    this.locale.isRtl()
      ? 'ملصق لكل وجبة · باركود لكل بوكس · بدون بيانات عميل'
      : 'One label per meal · barcode per box · no customer PII',
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
