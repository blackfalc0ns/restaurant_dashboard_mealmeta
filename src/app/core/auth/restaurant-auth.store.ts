import { Injectable, signal, computed } from '@angular/core';
import { RestaurantContext } from '@/core/auth/restaurant-context';

const STORAGE_KEY = 'mm_restaurant_session';

export interface RestaurantSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  restaurantId: string;
  isApproved: boolean;
  hasApprovedMenu: boolean;
  hasServiceArea: boolean;
  rememberSession?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RestaurantAuthStore {
  readonly accessToken = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly expiresAt = signal<string | null>(null);
  readonly restaurantId = signal<string | null>(null);
  readonly isApproved = signal<boolean>(false);
  readonly hasApprovedMenu = signal<boolean>(false);
  readonly hasServiceArea = signal<boolean>(false);
  private rememberSession = true;

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

  constructor() {
    this.restore();
  }

  setSession(session: RestaurantSession): void {
    this.accessToken.set(session.accessToken);
    this.refreshToken.set(session.refreshToken ?? null);
    this.expiresAt.set(session.expiresAt);
    this.restaurantId.set(session.restaurantId);
    this.isApproved.set(session.isApproved);
    this.hasApprovedMenu.set(session.hasApprovedMenu);
    this.hasServiceArea.set(session.hasServiceArea);
    this.rememberSession = session.rememberSession ?? true;
    this.persist();
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.expiresAt.set(null);
    this.restaurantId.set(null);
    this.isApproved.set(false);
    this.hasApprovedMenu.set(false);
    this.hasServiceArea.set(false);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private persist(): void {
    const payload: RestaurantSession = {
      accessToken: this.accessToken()!,
      refreshToken: this.refreshToken() ?? undefined,
      expiresAt: this.expiresAt()!,
      restaurantId: this.restaurantId()!,
      isApproved: this.isApproved(),
      hasApprovedMenu: this.hasApprovedMenu(),
      hasServiceArea: this.hasServiceArea(),
      rememberSession: this.rememberSession,
    };
    const raw = JSON.stringify(payload);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (this.rememberSession) localStorage.setItem(STORAGE_KEY, raw);
    else sessionStorage.setItem(STORAGE_KEY, raw);
  }

  private restore(): void {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const session = JSON.parse(raw) as RestaurantSession;
      if (!session.accessToken) return;
      this.setSession({ ...session, rememberSession: session.rememberSession ?? true });
    } catch {
      this.clearSession();
    }
  }
}
