import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-menu-detail-skeleton',
  standalone: true,
  templateUrl: './menu-detail-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-mnd-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class MenuDetailSkeletonComponent {}
