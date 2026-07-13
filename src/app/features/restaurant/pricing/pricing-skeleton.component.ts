import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-pricing-skeleton',
  standalone: true,
  templateUrl: './pricing-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-pr-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class PricingSkeletonComponent {}
