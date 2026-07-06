import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardInputDirective } from '@/shared/components/input';
import { RestaurantAuthFormCardComponent } from '../../layout/restaurant-auth-form-card.component';
import { RESTAURANT_LOGIN_I18N } from '../../i18n/login.i18n';
import { RestaurantAuthFacade } from '../../state/auth.facade';
import { RestaurantAuthLocaleService } from '../../state/auth-locale.service';

@Component({
  selector: 'mm-restaurant-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ZardCheckboxComponent,
    ZardInputDirective,
    RestaurantAuthFormCardComponent,
  ],
  templateUrl: './restaurant-login-page.component.html',
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
export class RestaurantLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly localeService = inject(RestaurantAuthLocaleService);
  readonly auth = inject(RestaurantAuthFacade);

  readonly showPassword = signal(false);
  readonly copy = computed(() => RESTAURANT_LOGIN_I18N[this.localeService.locale()]);
  readonly isSubmitting = computed(() => this.auth.viewState() === 'submitting');

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberSession: [false],
  });

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    this.auth.login(this.form.getRawValue());
  }
}
