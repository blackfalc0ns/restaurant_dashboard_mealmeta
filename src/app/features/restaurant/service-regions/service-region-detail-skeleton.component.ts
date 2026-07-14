import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-service-region-detail-skeleton',
  standalone: true,
  templateUrl: './service-region-detail-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ops-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ServiceRegionDetailSkeletonComponent {}
