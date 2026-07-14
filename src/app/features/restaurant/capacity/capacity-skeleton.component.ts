import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-capacity-skeleton',
  standalone: true,
  templateUrl: './capacity-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-cp-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class CapacitySkeletonComponent {
  readonly days = [1, 2, 3, 4, 5, 6, 7];
}
