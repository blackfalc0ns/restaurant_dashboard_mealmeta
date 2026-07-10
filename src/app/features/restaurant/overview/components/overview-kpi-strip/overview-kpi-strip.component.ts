import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownRight,
  lucideArrowRight,
  lucideArrowUpRight,
  lucideMinus,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmApexChartComponent } from '@/shared/components/apex-chart/mm-apex-chart.component';
import { mmSparklineChart } from '@/shared/components/apex-chart/apex-chart.theme';
import { BRAND_COLORS } from '@/core/brand/brand-colors';

import { OverviewKpi } from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-kpi-strip',
  standalone: true,
  imports: [RouterLink, NgIcon, MmApexChartComponent],
  templateUrl: './overview-kpi-strip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-kpis block' },
  viewProviders: [
    provideIcons({
      lucideArrowDownRight,
      lucideArrowRight,
      lucideArrowUpRight,
      lucideMinus,
    }),
  ],
})
export class OverviewKpiStripComponent {
  readonly kpis = input.required<OverviewKpi[]>();

  private readonly locale = inject(AppLocaleService);

  readonly sparkChart = mmSparklineChart();

  label(kpi: OverviewKpi): string {
    return pickLocale(kpi.label, this.locale.locale());
  }

  trend(kpi: OverviewKpi): string {
    return pickLocale(kpi.trendLabel, this.locale.locale());
  }

  trendIcon(kpi: OverviewKpi): string {
    if (kpi.trendDirection === 'up') return 'lucideArrowUpRight';
    if (kpi.trendDirection === 'down') return 'lucideArrowDownRight';
    return 'lucideMinus';
  }

  colors(kpi: OverviewKpi): string[] {
    switch (kpi.tone) {
      case 'accent':
        return [BRAND_COLORS.accent];
      case 'warning':
        return ['#d97706'];
      case 'neutral':
        return [BRAND_COLORS.ink];
      default:
        return [BRAND_COLORS.primary];
    }
  }

  series(kpi: OverviewKpi) {
    return [{ name: this.label(kpi), data: kpi.sparkline }];
  }
}
