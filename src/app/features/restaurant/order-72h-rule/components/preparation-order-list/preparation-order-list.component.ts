import { Component, Input } from '@angular/core';
import { ConfirmationCountdownComponent } from '../confirmation-countdown/confirmation-countdown.component';
import {
  RestaurantOrder72hRow,
  Upcoming24hOrderRow,
} from '../../models';

@Component({
  selector: 'mm-preparation-order-list',
  standalone: true,
  imports: [ConfirmationCountdownComponent],
  templateUrl: './preparation-order-list.component.html',
  styleUrl: './preparation-order-list.component.scss',
})
export class PreparationOrderListComponent {
  @Input() rows: RestaurantOrder72hRow[] = [];
  @Input() upcomingRows: Upcoming24hOrderRow[] = [];
  @Input({ required: true }) mode!: 'pending-confirmation' | 'upcoming-24h';
}
