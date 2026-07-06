import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { RestaurantAuthApiService } from '../data/auth-api.service';
import { AUTH_DESIGN_EMAIL, AUTH_DESIGN_MODE } from '../config/auth-design.config';

@Injectable()
export class RestaurantAuthRecoveryFacade {
  private readonly api = inject(RestaurantAuthApiService);
  private readonly router = inject(Router);

  readonly email = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly resendCooldown = signal(0);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  requestOtp(email: string): void {
    const resolvedEmail = email.trim() || (AUTH_DESIGN_MODE ? AUTH_DESIGN_EMAIL : '');
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.api.sendOtp({ email: resolvedEmail }).subscribe({
      next: () => {
        this.email.set(resolvedEmail);
        this.isSubmitting.set(false);
        this.startResendCooldown();
        void this.router.navigateByUrl('/restaurant/verify-otp');
      },
      error: (err: Error) => {
        if (AUTH_DESIGN_MODE) {
          this.email.set(resolvedEmail);
          this.isSubmitting.set(false);
          this.startResendCooldown();
          void this.router.navigateByUrl('/restaurant/verify-otp');
          return;
        }
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  ensureDesignContext(): void {
    if (AUTH_DESIGN_MODE && !this.email()) {
      this.email.set(AUTH_DESIGN_EMAIL);
    }
  }

  verifyOtp(code: string): void {
    this.ensureDesignContext();
    const email = this.email() ?? (AUTH_DESIGN_MODE ? AUTH_DESIGN_EMAIL : null);
    if (!email) {
      void this.router.navigateByUrl('/restaurant/forgot-password');
      return;
    }

    const resolvedCode = code.trim() || (AUTH_DESIGN_MODE ? '000000' : '');

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.api.verifyOtp({ email, code: resolvedCode }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        // TODO: navigate to reset-password page when implemented
      },
      error: (err: Error) => {
        if (AUTH_DESIGN_MODE) {
          this.isSubmitting.set(false);
          return;
        }
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  resendOtp(): void {
    this.ensureDesignContext();
    const email = this.email();
    if (!email || this.resendCooldown() > 0) {
      return;
    }

    this.errorMessage.set(null);

    this.api.sendOtp({ email }).subscribe({
      next: () => this.startResendCooldown(),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }

  clear(): void {
    this.email.set(null);
    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.clearCooldown();
  }

  private startResendCooldown(seconds = 60): void {
    this.clearCooldown();
    this.resendCooldown.set(seconds);

    this.cooldownTimer = setInterval(() => {
      const next = this.resendCooldown() - 1;
      if (next <= 0) {
        this.resendCooldown.set(0);
        this.clearCooldown();
        return;
      }
      this.resendCooldown.set(next);
    }, 1000);
  }

  private clearCooldown(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }
}
