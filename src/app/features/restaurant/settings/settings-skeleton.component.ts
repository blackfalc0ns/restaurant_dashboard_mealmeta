import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-settings-skeleton',
  standalone: true,
  templateUrl: './settings-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-due-skeleton block w-full',
    'aria-busy': 'true',
    'aria-live': 'polite',
  },
})
export class SettingsSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5, 6];
}
