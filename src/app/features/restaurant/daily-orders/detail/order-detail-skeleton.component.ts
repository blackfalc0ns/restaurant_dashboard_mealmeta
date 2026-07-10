import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-order-detail-skeleton',
  standalone: true,
  templateUrl: './order-detail-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-od-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class OrderDetailSkeletonComponent {}
