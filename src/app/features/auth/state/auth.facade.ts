import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantAuthStore } from '@/core/auth/restaurant-auth.store';
import { RestaurantAuthApiService } from '../data/auth-api.service';
import { RestaurantLoginRequest, RestaurantLoginViewState } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class RestaurantAuthFacade {
  private readonly api = inject(RestaurantAuthApiService);
  private readonly router = inject(Router);
  private readonly authStore = inject(RestaurantAuthStore);

  readonly viewState = signal<RestaurantLoginViewState>('idle');
  readonly errorMessage = signal<string | null>(null);

  readonly isSubmitting = computed(() => this.viewState() === 'submitting');

  login(request: RestaurantLoginRequest): void {
    this.viewState.set('submitting');
    this.errorMessage.set(null);

    this.api.login(request).subscribe({
      next: (response) => {
        this.authStore.setSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt: response.expiresAt,
          restaurantId: response.restaurantId,
          isApproved: response.isApproved,
          hasApprovedMenu: response.hasApprovedMenu,
          hasServiceArea: response.hasServiceArea,
          rememberSession: request.rememberSession,
        });
        this.viewState.set('idle');

        if (response.isApproved && response.hasApprovedMenu && response.hasServiceArea) {
          void this.router.navigateByUrl('/restaurant/orders/pending-confirmation', { replaceUrl: true });
        } else if (!response.isApproved) {
          void this.router.navigateByUrl('/restaurant/under-review', { replaceUrl: true });
        } else {
          void this.router.navigateByUrl('/restaurant/setup-wizard', { replaceUrl: true });
        }
      },
      error: (err: Error) => {
        this.viewState.set('error');
        this.errorMessage.set(err.message ?? 'فشل تسجيل دخول شريك المطعم');
      },
    });
  }

  logout(): void {
    const refresh = this.authStore.refreshToken();
    this.api.logout(refresh).subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authStore.clearSession();
    void this.router.navigateByUrl('/restaurant/login', { replaceUrl: true });
  }
}
