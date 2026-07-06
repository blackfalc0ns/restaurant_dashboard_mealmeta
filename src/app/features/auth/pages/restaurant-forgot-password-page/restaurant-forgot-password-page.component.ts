import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ZardInputDirective } from '@/shared/components/input';
import { RestaurantAuthFormCardComponent } from '../../layout/restaurant-auth-form-card.component';
import { RESTAURANT_FORGOT_PASSWORD_I18N } from '../../i18n/forgot-password.i18n';
import { RestaurantAuthLocaleService } from '../../state/auth-locale.service';
import { RestaurantAuthRecoveryFacade } from '../../state/auth-recovery.facade';

@Component({
  selector: 'mm-restaurant-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ZardInputDirective, RestaurantAuthFormCardComponent],
  templateUrl: './restaurant-forgot-password-page.component.html',
  styles: [
    `
      .mm-auth-field {
        font-weight: 600;
        color: rgb(28 25 23);
      }

      .mm-auth-field::placeholder {
        color: rgb(135 133 128 / 0.8);
        font-weight: 600;
        opacity: 1;
      }
    `,
  ],
})
export class RestaurantForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly localeService = inject(RestaurantAuthLocaleService);
  readonly recovery = inject(RestaurantAuthRecoveryFacade);

  readonly copy = computed(() => RESTAURANT_FORGOT_PASSWORD_I18N[this.localeService.locale()]);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    this.recovery.requestOtp(this.form.controls.email.value);
  }
}
