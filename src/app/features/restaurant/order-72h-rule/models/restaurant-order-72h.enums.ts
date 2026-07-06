/** Timeline phase for restaurant F06 views. */
export enum RestaurantOrderPhase {
  PendingConfirmation = 'pending_confirmation',
  Confirmed = 'confirmed',
  ConfirmationOverdue = 'confirmation_overdue',
  Preparing = 'preparing',
  ReadyForDriver = 'ready_for_driver',
  Delivered = 'delivered',
}

export enum ConfirmationCountdownState {
  Normal = 'normal',
  Warning = 'warning',
  Overdue = 'overdue',
}
