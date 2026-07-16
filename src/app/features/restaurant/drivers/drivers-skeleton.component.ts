import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-drivers-skeleton',
  standalone: true,
  templateUrl: './drivers-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-dr-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class DriversSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5, 6];
}
