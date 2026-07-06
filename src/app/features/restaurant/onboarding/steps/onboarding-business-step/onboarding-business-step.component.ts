import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-business-step',
  standalone: true,
  imports: [ReactiveFormsModule, ZardInputDirective],
  template: `
    <form class="mm-onboarding__form" [formGroup]="form">
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="restaurantName">{{ copy().fields.restaurantName }}</label>
        <input id="restaurantName" z-input class="mm-onboarding__input" formControlName="restaurantName" />
      </div>
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="legalCompanyName">{{ copy().fields.legalCompanyName }}</label>
        <input id="legalCompanyName" z-input class="mm-onboarding__input" formControlName="legalCompanyName" />
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="crNumber">{{ copy().fields.crNumber }}</label>
        <input id="crNumber" z-input class="mm-onboarding__input" formControlName="commercialRegistrationNumber" dir="ltr" />
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="ownerName">{{ copy().fields.ownerName }}</label>
        <input id="ownerName" z-input class="mm-onboarding__input" formControlName="ownerName" />
      </div>
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="ownerNationalId">
          {{ copy().fields.ownerNationalId }}
          <span class="text-mm-ink-muted font-normal">({{ copy().fields.optional }})</span>
        </label>
        <input id="ownerNationalId" z-input class="mm-onboarding__input" formControlName="ownerNationalId" dir="ltr" />
      </div>
    </form>
  `,
})
export class OnboardingBusinessStepComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly form = this.fb.nonNullable.group({
    restaurantName: [this.facade.draft().business.restaurantName],
    legalCompanyName: [this.facade.draft().business.legalCompanyName],
    commercialRegistrationNumber: [this.facade.draft().business.commercialRegistrationNumber],
    ownerName: [this.facade.draft().business.ownerName],
    ownerNationalId: [this.facade.draft().business.ownerNationalId],
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.facade.updateDraft('business', {
        restaurantName: value.restaurantName ?? '',
        legalCompanyName: value.legalCompanyName ?? '',
        commercialRegistrationNumber: value.commercialRegistrationNumber ?? '',
        ownerName: value.ownerName ?? '',
        ownerNationalId: value.ownerNationalId ?? '',
      });
    });
  }
}
