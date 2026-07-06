import { Injectable, signal, computed } from '@angular/core';
import { RestaurantContext } from '@/core/auth/restaurant-context';

export interface RestaurantSession {
  accessToken: string;
  expiresAt: string;
  restaurantId: string;
  isApproved: boolean;
  hasApprovedMenu: boolean;
  hasServiceArea: boolean;
}

@Injectable({ providedIn: 'root' })
export class RestaurantAuthStore {
  readonly accessToken = signal<string | null>(null);
  readonly expiresAt = signal<string | null>(null);
  readonly restaurantId = signal<string | null>(null);
  readonly isApproved = signal<boolean>(false);
  readonly hasApprovedMenu = signal<boolean>(false);
  readonly hasServiceArea = signal<boolean>(false);

  readonly isAuthenticated = computed(() => Boolean(this.accessToken()));

  readonly context = computed<RestaurantContext | null>(() => {
    const id = this.restaurantId();
    if (!id) return null;
    return {
      restaurantId: id,
      isApproved: this.isApproved(),
      hasApprovedMenu: this.hasApprovedMenu(),
      hasServiceArea: this.hasServiceArea(),
    };
  });

  setSession(session: RestaurantSession): void {
    this.accessToken.set(session.accessToken);
    this.expiresAt.set(session.expiresAt);
    this.restaurantId.set(session.restaurantId);
    this.isApproved.set(session.isApproved);
    this.hasApprovedMenu.set(session.hasApprovedMenu);
    this.hasServiceArea.set(session.hasServiceArea);
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.expiresAt.set(null);
    this.restaurantId.set(null);
    this.isApproved.set(false);
    this.hasApprovedMenu.set(false);
    this.hasServiceArea.set(false);
  }
}
