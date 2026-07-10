import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-activity-skeleton',
  standalone: true,
  templateUrl: './activity-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ac-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ActivitySkeletonComponent {}
