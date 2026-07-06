/** Confirm / reject actions for 24h restaurant confirmation window. */
export interface ConfirmOrderRequest {
  note?: string;
}

export interface RejectConfirmationRequest {
  reason: string;
}

export interface OrderConfirmationResult {
  orderId: string;
  confirmedAt: string;
  phase: string;
}
