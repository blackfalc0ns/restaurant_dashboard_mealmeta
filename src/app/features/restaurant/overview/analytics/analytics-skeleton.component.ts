import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-analytics-skeleton',
  standalone: true,
  templateUrl: './analytics-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-an-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class AnalyticsSkeletonComponent {}
