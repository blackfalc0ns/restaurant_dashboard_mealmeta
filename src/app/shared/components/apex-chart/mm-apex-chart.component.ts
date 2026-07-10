import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

import { MM_CHART_PALETTE } from './apex-chart.theme';

@Component({
  selector: 'mm-apex-chart',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <apx-chart
      [series]="series()"
      [chart]="chart()"
      [colors]="colors()"
      [labels]="labels()"
      [xaxis]="xaxis() ?? {}"
      [yaxis]="yaxis() ?? {}"
      [stroke]="stroke() ?? {}"
      [fill]="fill() ?? {}"
      [grid]="grid() ?? {}"
      [legend]="legend() ?? {}"
      [tooltip]="tooltip() ?? {}"
      [dataLabels]="dataLabels() ?? {}"
      [markers]="markers() ?? {}"
      [plotOptions]="plotOptions() ?? {}"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class MmApexChartComponent {
  readonly series = input.required<ApexAxisChartSeries | ApexNonAxisChartSeries>();
  readonly chart = input.required<ApexChart>();
  readonly colors = input<string[]>(MM_CHART_PALETTE);
  readonly labels = input<string[]>([]);
  readonly xaxis = input<ApexXAxis>();
  readonly yaxis = input<ApexYAxis | ApexYAxis[]>();
  readonly stroke = input<ApexStroke>();
  readonly fill = input<ApexFill>();
  readonly grid = input<ApexGrid>();
  readonly legend = input<ApexLegend>();
  readonly tooltip = input<ApexTooltip>();
  readonly dataLabels = input<ApexDataLabels>();
  readonly markers = input<ApexMarkers>();
  readonly plotOptions = input<ApexPlotOptions>();
}
