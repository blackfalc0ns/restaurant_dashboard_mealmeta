import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-invoices-skeleton',
  standalone: true,
  templateUrl: './invoices-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class InvoicesSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
