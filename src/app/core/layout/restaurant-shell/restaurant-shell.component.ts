import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RestaurantHeaderComponent } from '../restaurant-header/restaurant-header.component';
import { RestaurantShellLayoutService } from '../restaurant-shell-layout.service';
import { RestaurantSidebarComponent } from '../restaurant-sidebar/restaurant-sidebar.component';

@Component({
  selector: 'mm-restaurant-shell',
  standalone: true,
  imports: [RouterOutlet, RestaurantSidebarComponent, RestaurantHeaderComponent],
  providers: [RestaurantShellLayoutService],
  templateUrl: './restaurant-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-dvh',
  },
})
export class RestaurantShellComponent {
  protected readonly layout = inject(RestaurantShellLayoutService);

  closeMobileNav(): void {
    this.layout.closeMobileNav();
  }
}
