import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-archive-skeleton',
  standalone: true,
  templateUrl: './archive-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-oa-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class ArchiveSkeletonComponent {}
