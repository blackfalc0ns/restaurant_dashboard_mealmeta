import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-dues-skeleton',
  standalone: true,
  templateUrl: './dues-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class DuesSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
