import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-quality-overview-skeleton',
  standalone: true,
  templateUrl: './quality-overview-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ql-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class QualityOverviewSkeletonComponent {}
