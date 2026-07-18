import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-team-skeleton',
  standalone: true,
  template: `
    <div class="mm-team-skel mm-ops-scroll" aria-hidden="true">
      <div class="mm-team-skel__hero"></div>
      <div class="mm-team-skel__board">
        <div class="mm-team-skel__line"></div>
        <div class="mm-team-skel__line is-short"></div>
        <div class="mm-team-skel__row"></div>
        <div class="mm-team-skel__row"></div>
        <div class="mm-team-skel__row"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class TeamSkeletonComponent {}
