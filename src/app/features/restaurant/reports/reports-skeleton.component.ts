import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-reports-skeleton',
  standalone: true,
  templateUrl: './reports-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ReportsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
