import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-ingredients-skeleton',
  standalone: true,
  templateUrl: './ingredients-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ig-skeleton block',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class IngredientsSkeletonComponent {}
