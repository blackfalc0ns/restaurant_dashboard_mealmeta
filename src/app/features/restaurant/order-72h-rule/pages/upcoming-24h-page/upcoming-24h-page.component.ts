import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { PreparationOrderListComponent } from '../../components/preparation-order-list/preparation-order-list.component';
import { RestaurantOrder72hFacade } from '../../state/restaurant-order-72h.facade';

@Component({
  selector: 'mm-upcoming-24h-page',
  standalone: true,
  imports: [PageStateComponent, PreparationOrderListComponent],
  templateUrl: './upcoming-24h-page.component.html',
  styleUrl: './upcoming-24h-page.component.scss',
})
export class Upcoming24hPageComponent implements OnInit {
  readonly facade = inject(RestaurantOrder72hFacade);

  ngOnInit(): void {
    this.facade.loadUpcoming24h();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
