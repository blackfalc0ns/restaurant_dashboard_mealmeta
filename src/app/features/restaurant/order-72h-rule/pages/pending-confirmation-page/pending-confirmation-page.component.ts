import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { PreparationOrderListComponent } from '../../components/preparation-order-list/preparation-order-list.component';
import { ConfirmOrderDialogComponent } from '../../components/confirm-order-dialog/confirm-order-dialog.component';
import { RestaurantOrder72hFacade } from '../../state/restaurant-order-72h.facade';

@Component({
  selector: 'mm-pending-confirmation-page',
  standalone: true,
  imports: [
    PageStateComponent,
    PreparationOrderListComponent,
    ConfirmOrderDialogComponent,
  ],
  templateUrl: './pending-confirmation-page.component.html',
  styleUrl: './pending-confirmation-page.component.scss',
})
export class PendingConfirmationPageComponent implements OnInit {
  readonly facade = inject(RestaurantOrder72hFacade);

  ngOnInit(): void {
    this.facade.loadPendingConfirmation();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
