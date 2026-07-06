import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { ConfirmationCountdownComponent } from '../../components/confirmation-countdown/confirmation-countdown.component';
import { RestaurantOrder72hFacade } from '../../state/restaurant-order-72h.facade';

@Component({
  selector: 'mm-order-72h-detail-page',
  standalone: true,
  imports: [PageStateComponent, ConfirmationCountdownComponent],
  templateUrl: './order-72h-detail-page.component.html',
  styleUrl: './order-72h-detail-page.component.scss',
})
export class Order72hDetailPageComponent implements OnInit {
  readonly facade = inject(RestaurantOrder72hFacade);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.facade.loadOrderDetail(orderId);
    }
  }

  onRetry(): void {
    this.facade.retry();
  }
}
