import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-handover-detail-skeleton',
  standalone: true,
  templateUrl: './handover-detail-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-hod-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class HandoverDetailSkeletonComponent {}
