import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-statements-skeleton',
  standalone: true,
  templateUrl: './statements-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class StatementsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
