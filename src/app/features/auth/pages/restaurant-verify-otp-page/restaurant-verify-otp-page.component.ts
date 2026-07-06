import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OtpInputComponent } from '../../components/otp-input/otp-input.component';
import { AUTH_DESIGN_EMAIL } from '../../config/auth-design.config';
import { RestaurantAuthFormCardComponent } from '../../layout/restaurant-auth-form-card.component';
import { RESTAURANT_VERIFY_OTP_I18N } from '../../i18n/verify-otp.i18n';
import { RestaurantAuthLocaleService } from '../../state/auth-locale.service';
import { RestaurantAuthRecoveryFacade } from '../../state/auth-recovery.facade';

@Component({
  selector: 'mm-restaurant-verify-otp-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, OtpInputComponent, RestaurantAuthFormCardComponent],
  templateUrl: './restaurant-verify-otp-page.component.html',
})
export class RestaurantVerifyOtpPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly localeService = inject(RestaurantAuthLocaleService);
  readonly recovery = inject(RestaurantAuthRecoveryFacade);

  readonly copy = computed(() => RESTAURANT_VERIFY_OTP_I18N[this.localeService.locale()]);
  readonly maskedEmail = computed(() =>
    this.maskEmail(this.recovery.email() ?? AUTH_DESIGN_EMAIL)
  );

  readonly form = this.fb.nonNullable.group({
    code: [''],
  });

  ngOnInit(): void {
    this.recovery.ensureDesignContext();
  }

  onSubmit(): void {
    this.recovery.verifyOtp(this.form.controls.code.value);
  }

  resend(): void {
    this.form.controls.code.reset();
    this.recovery.resendOtp();
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) {
      return email;
    }

    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${domain}`;
  }
}
