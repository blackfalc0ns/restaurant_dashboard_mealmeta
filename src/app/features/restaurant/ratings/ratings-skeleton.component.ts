import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-ratings-skeleton',
  standalone: true,
  templateUrl: './ratings-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-rt-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class RatingsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5, 6];
}
