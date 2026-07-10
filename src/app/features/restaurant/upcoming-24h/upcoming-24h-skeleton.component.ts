import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-upcoming-24h-skeleton',
  standalone: true,
  templateUrl: './upcoming-24h-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-u24-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class Upcoming24hSkeletonComponent {}
