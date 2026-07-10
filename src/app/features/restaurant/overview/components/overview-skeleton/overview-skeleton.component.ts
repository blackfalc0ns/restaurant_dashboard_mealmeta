import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-overview-skeleton',
  standalone: true,
  templateUrl: './overview-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ov-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class OverviewSkeletonComponent {}
