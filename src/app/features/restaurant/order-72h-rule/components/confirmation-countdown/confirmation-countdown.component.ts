import { Component, Input } from '@angular/core';
import { ConfirmationCountdownState } from '../../models';

@Component({
  selector: 'mm-confirmation-countdown',
  standalone: true,
  templateUrl: './confirmation-countdown.component.html',
  styleUrl: './confirmation-countdown.component.scss',
})
export class ConfirmationCountdownComponent {
  @Input({ required: true }) deadlineAt!: string;
  @Input({ required: true }) hoursRemaining!: number;
  @Input({ required: true }) state!: ConfirmationCountdownState;
}
