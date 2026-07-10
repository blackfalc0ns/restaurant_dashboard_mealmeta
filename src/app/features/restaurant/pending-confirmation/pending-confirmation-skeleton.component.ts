import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-pending-confirmation-skeleton',
  standalone: true,
  templateUrl: './pending-confirmation-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-pc-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class PendingConfirmationSkeletonComponent {}
