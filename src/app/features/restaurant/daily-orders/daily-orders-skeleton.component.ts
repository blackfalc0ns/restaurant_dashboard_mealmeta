import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-daily-orders-skeleton',
  standalone: true,
  templateUrl: './daily-orders-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-do-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class DailyOrdersSkeletonComponent {}
