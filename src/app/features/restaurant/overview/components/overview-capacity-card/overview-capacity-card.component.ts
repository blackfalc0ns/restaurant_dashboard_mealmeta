import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_COLORS } from '@/core/brand/brand-colors';
import { MmApexChartComponent } from '@/shared/components/apex-chart/mm-apex-chart.component';
import {
  mmBaseChart,
  mmBaseGrid,
  mmBaseStroke,
  mmBaseTooltip,
  mmBaseXAxis,
  mmBaseYAxis,
} from '@/shared/components/apex-chart/apex-chart.theme';

import { OverviewCapacitySnapshot } from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-capacity-card',
  standalone: true,
  imports: [RouterLink, MmApexChartComponent],
  templateUrl: './overview-capacity-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-card mm-ov-capacity block' },
})
export class OverviewCapacityCardComponent {
  readonly capacity = input.required<OverviewCapacitySnapshot>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'الطاقة اليومية وحالة Busy' : 'Daily capacity & Busy',
  );
  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'الاستغلال مقابل قاعدة الطاقة اليومية'
      : 'Utilization against the daily capacity rule',
  );
  readonly manageLabel = computed(() =>
    this.locale.isRtl() ? 'إدارة الطاقة' : 'Manage capacity',
  );
  readonly usedLabel = computed(() =>
    this.locale.isRtl() ? 'مستخدم' : 'Used',
  );
  readonly ofLabel = computed(() => (this.locale.isRtl() ? 'من' : 'of'));
  readonly busyLabel = computed(() => {
    if (this.capacity().busy) {
      return this.locale.isRtl() ? 'Busy مفعّل' : 'Busy on';
    }
    return this.locale.isRtl() ? 'متاح للاستقبال' : 'Accepting orders';
  });

  readonly chart = mmBaseChart('area', 160);
  readonly grid = { ...mmBaseGrid(), padding: { left: 4, right: 4, top: 0, bottom: 0 } };
  readonly stroke = mmBaseStroke('smooth');
  readonly tooltip = mmBaseTooltip();
  readonly yaxis = { ...mmBaseYAxis(), show: false, min: 0, max: 100 };
  readonly colors = [BRAND_COLORS.primary];

  readonly xaxis = computed(() =>
    mmBaseXAxis(
      this.capacity().weekdayLabels.map((label) =>
        pickLocale(label, this.locale.locale()),
      ),
    ),
  );

  readonly series = computed(() => [
    {
      name: this.locale.isRtl() ? 'الاستغلال %' : 'Utilization %',
      data: this.capacity().weeklyUtilization,
    },
  ]);

  readonly fill = {
    type: 'gradient' as const,
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  };
}
