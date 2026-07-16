import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-dispatch-officers-skeleton',
  standalone: true,
  templateUrl: './dispatch-officers-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-dsp-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class DispatchOfficersSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
