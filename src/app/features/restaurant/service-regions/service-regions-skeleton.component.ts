import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-service-regions-skeleton',
  standalone: true,
  templateUrl: './service-regions-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ops-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ServiceRegionsSkeletonComponent {}
