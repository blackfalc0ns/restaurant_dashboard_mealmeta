import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-operations-skeleton',
  standalone: true,
  templateUrl: './operations-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-op-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class OperationsSkeletonComponent {}
