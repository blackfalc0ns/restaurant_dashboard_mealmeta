import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-trips-skeleton',
  standalone: true,
  templateUrl: './trips-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-tp-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class TripsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
