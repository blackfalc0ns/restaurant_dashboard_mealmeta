import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_COLORS } from '@/core/brand/brand-colors';
import { MmApexChartComponent } from '@/shared/components/apex-chart/mm-apex-chart.component';
import { mmSparklineChart } from '@/shared/components/apex-chart/apex-chart.theme';

import { OverviewFinanceSnapshot } from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-finance-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, MmApexChartComponent],
  templateUrl: './overview-finance-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-card mm-ov-finance block' },
})
export class OverviewFinanceCardComponent {
  readonly finance = input.required<OverviewFinanceSnapshot>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'النظرة المالية' : 'Finance overview',
  );
  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'مستحقات وخصومات وفواتير الشهر'
      : 'Dues, deductions, and monthly invoices',
  );
  readonly viewLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );
  readonly pendingLabel = computed(() =>
    this.locale.isRtl() ? 'مستحق معلّق' : 'Pending payout',
  );
  readonly invoiceLabel = computed(() =>
    pickLocale(this.finance().lastInvoiceLabel, this.locale.locale()),
  );
  readonly deductionsLabel = computed(() =>
    this.locale.isRtl() ? 'خصومات الشكاوى' : 'Complaint deductions',
  );
  readonly kd = computed(() => (this.locale.isRtl() ? 'د.ك' : 'KD'));

  readonly sparkChart = mmSparklineChart();
  readonly colors = [BRAND_COLORS.secondary];

  readonly series = computed(() => [
    {
      name: this.locale.isRtl() ? 'الفواتير' : 'Invoices',
      data: this.finance().monthTrend,
    },
  ]);
}
