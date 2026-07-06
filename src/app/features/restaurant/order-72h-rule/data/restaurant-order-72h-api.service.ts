import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantApiEndpoints } from '../../../core/api/restaurant-api-endpoints';
import {
  ConfirmOrderRequest,
  OrderConfirmationResult,
  PaginatedRestaurantOrder72hResponse,
  RejectConfirmationRequest,
  RestaurantOrder72hFilter,
  Upcoming24hListResponse,
} from '../models';

/**
 * HTTP layer for F06 restaurant operations.
 * Wire HttpClient when Angular app is bootstrapped.
 */
@Injectable({ providedIn: 'root' })
export class RestaurantOrder72hApiService {
  readonly endpoints = RestaurantApiEndpoints;

  getPendingConfirmation(
    _filter: RestaurantOrder72hFilter
  ): Observable<PaginatedRestaurantOrder72hResponse> {
    throw new Error(
      'RestaurantOrder72hApiService.getPendingConfirmation — not implemented'
    );
  }

  getUpcoming24h(): Observable<Upcoming24hListResponse> {
    throw new Error(
      'RestaurantOrder72hApiService.getUpcoming24h — not implemented'
    );
  }

  getOrderById(_orderId: string): Observable<unknown> {
    throw new Error(
      'RestaurantOrder72hApiService.getOrderById — not implemented'
    );
  }

  confirmOrder(
    _orderId: string,
    _request: ConfirmOrderRequest
  ): Observable<OrderConfirmationResult> {
    throw new Error(
      'RestaurantOrder72hApiService.confirmOrder — not implemented'
    );
  }

  rejectConfirmation(
    _orderId: string,
    _request: RejectConfirmationRequest
  ): Observable<void> {
    throw new Error(
      'RestaurantOrder72hApiService.rejectConfirmation — not implemented'
    );
  }
}
