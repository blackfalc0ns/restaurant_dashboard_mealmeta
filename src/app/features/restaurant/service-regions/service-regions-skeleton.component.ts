import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-service-regions-skeleton',
  standalone: true,
  templateUrl: './service-regions-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-sr-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ServiceRegionsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5, 6];
}
