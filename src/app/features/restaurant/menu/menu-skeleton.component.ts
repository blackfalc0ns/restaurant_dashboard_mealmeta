import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-menu-skeleton',
  standalone: true,
  templateUrl: './menu-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-mn-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class MenuSkeletonComponent {}
