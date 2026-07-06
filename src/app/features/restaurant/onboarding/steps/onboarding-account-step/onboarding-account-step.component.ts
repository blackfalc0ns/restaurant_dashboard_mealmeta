import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-account-step',
  standalone: true,
  imports: [ReactiveFormsModule, ZardInputDirective],
  template: `
    <form class="mm-onboarding__form" [formGroup]="form">
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="email">{{ copy().fields.email }}</label>
        <input id="email" z-input type="email" class="mm-onboarding__input" formControlName="email" autocomplete="email" />
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="phone">{{ copy().fields.phone }}</label>
        <input id="phone" z-input type="tel" class="mm-onboarding__input" formControlName="phone" autocomplete="tel" dir="ltr" />
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="password">{{ copy().fields.password }}</label>
        <input id="password" z-input type="password" class="mm-onboarding__input" formControlName="password" autocomplete="new-password" />
      </div>
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="confirmPassword">{{ copy().fields.confirmPassword }}</label>
        <input id="confirmPassword" z-input type="password" class="mm-onboarding__input" formControlName="confirmPassword" autocomplete="new-password" />
      </div>
    </form>
  `,
})
export class OnboardingAccountStepComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly form = this.fb.nonNullable.group({
    email: [this.facade.draft().account.email],
    phone: [this.facade.draft().account.phone],
    password: [this.facade.draft().account.password],
    confirmPassword: [this.facade.draft().account.confirmPassword],
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.facade.updateDraft('account', {
        email: value.email ?? '',
        phone: value.phone ?? '',
        password: value.password ?? '',
        confirmPassword: value.confirmPassword ?? '',
      });
    });
  }
}
