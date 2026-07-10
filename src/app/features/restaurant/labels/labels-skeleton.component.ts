import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-labels-skeleton',
  standalone: true,
  templateUrl: './labels-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-lb-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class LabelsSkeletonComponent {}
