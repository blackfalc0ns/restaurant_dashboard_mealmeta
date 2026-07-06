import {
  ConfirmationCountdownState,
  RestaurantOrderPhase,
} from './restaurant-order-72h.enums';

/** Restaurant order row at −72h awaiting confirmation. */
export interface RestaurantOrder72hRow {
  orderId: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  customerMaskedId: string;
  mealSummary: string;
  phase: RestaurantOrderPhase;
  receivedAt: string;
  confirmationDeadlineAt: string;
  hoursUntilConfirmationDeadline: number;
  countdownState: ConfirmationCountdownState;
  isReassigned: boolean;
}

export interface RestaurantOrder72hFilter {
  deliveryDateFrom?: string;
  deliveryDateTo?: string;
  phase?: RestaurantOrderPhase;
  page: number;
  pageSize: number;
}

export interface PaginatedRestaurantOrder72hResponse {
  items: RestaurantOrder72hRow[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/** −24h upcoming delivery preparation list item. */
export interface Upcoming24hOrderRow {
  orderId: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  mealSummary: string;
  invoiceGenerated: boolean;
  barcodeGenerated: boolean;
  labelsGenerated: boolean;
  phase: RestaurantOrderPhase;
}

export interface Upcoming24hListResponse {
  items: Upcoming24hOrderRow[];
  totalCount: number;
}
