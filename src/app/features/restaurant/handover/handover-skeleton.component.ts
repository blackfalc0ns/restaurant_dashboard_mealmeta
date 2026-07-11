import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-handover-skeleton',
  standalone: true,
  templateUrl: './handover-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ho-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class HandoverSkeletonComponent {}
