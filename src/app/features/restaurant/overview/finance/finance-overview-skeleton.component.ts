import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-finance-overview-skeleton',
  standalone: true,
  templateUrl: './finance-overview-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-fn-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class FinanceOverviewSkeletonComponent {}
