import { Injectable } from '@angular/core';
import { PageStateModel } from '@/shared/models/page-view-state.model';
import {
  RestaurantOrder72hFilter,
  RestaurantOrder72hRow,
  Upcoming24hOrderRow,
} from '../models';

/** Facade state for restaurant F06 feature pages. */
export interface RestaurantOrder72hFacadeState {
  page: PageStateModel;
  pendingRows: RestaurantOrder72hRow[];
  upcoming24hRows: Upcoming24hOrderRow[];
  selectedOrderId: string | null;
  filter: RestaurantOrder72hFilter;
}

const initialFilter: RestaurantOrder72hFilter = {
  page: 1,
  pageSize: 20,
};

const initialState: RestaurantOrder72hFacadeState = {
  page: { viewState: 'idle' },
  pendingRows: [],
  upcoming24hRows: [],
  selectedOrderId: null,
  filter: initialFilter,
};

/**
 * Orchestrates F06 restaurant pages — components consume this, not API directly.
 */
@Injectable({ providedIn: 'root' })
export class RestaurantOrder72hFacade {
  readonly state: RestaurantOrder72hFacadeState = { ...initialState };

  loadPendingConfirmation(): void {
    // TODO: load orders at −72h awaiting 24h confirmation
  }

  loadUpcoming24h(): void {
    // TODO: load −24h preparation list
  }

  loadOrderDetail(_orderId: string): void {
    // TODO: load single order with countdown
  }

  confirmOrder(_orderId: string): void {
    // TODO: confirm within 24h window
  }

  retry(): void {
    // TODO: retry last failed action
  }

  reset(): void {
    Object.assign(this.state, initialState);
  }
}
