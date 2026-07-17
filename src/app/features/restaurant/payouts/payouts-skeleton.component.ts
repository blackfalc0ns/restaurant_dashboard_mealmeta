import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-payouts-skeleton',
  standalone: true,
  templateUrl: './payouts-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class PayoutsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
