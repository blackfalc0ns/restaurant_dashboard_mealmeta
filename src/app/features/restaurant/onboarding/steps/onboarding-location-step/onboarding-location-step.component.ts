import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';
import { KUWAIT_REGIONS } from '../../data/onboarding.defaults';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-location-step',
  standalone: true,
  imports: [ReactiveFormsModule, ZardInputDirective],
  template: `
    <form class="mm-onboarding__form" [formGroup]="form">
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="country">{{ copy().fields.country }}</label>
        <select id="country" class="mm-onboarding__input mm-onboarding__select" formControlName="countryId">
          <option value="kw">{{ facade.localeService.isRtl() ? 'الكويت' : 'Kuwait' }}</option>
        </select>
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="region">{{ copy().fields.region }}</label>
        <select id="region" class="mm-onboarding__input mm-onboarding__select" formControlName="regionId">
          <option value="">{{ facade.localeService.isRtl() ? 'اختر المحافظة' : 'Select governorate' }}</option>
          @for (region of regions; track region.id) {
            <option [value]="region.id">{{ facade.localeService.isRtl() ? region.ar : region.en }}</option>
          }
        </select>
      </div>
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="address">{{ copy().fields.address }}</label>
        <textarea id="address" class="mm-onboarding__input min-h-20 resize-y py-2.5" formControlName="address" rows="3"></textarea>
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="contactPerson">{{ copy().fields.contactPerson }}</label>
        <input id="contactPerson" z-input class="mm-onboarding__input" formControlName="contactPersonName" />
      </div>
      <div class="mm-onboarding__field">
        <label class="mm-onboarding__label" for="contactPhone">{{ copy().fields.contactPhone }}</label>
        <input id="contactPhone" z-input type="tel" class="mm-onboarding__input" formControlName="contactPhone" dir="ltr" />
      </div>
      <div class="mm-onboarding__field mm-onboarding__field--full">
        <label class="mm-onboarding__label" for="contactEmail">
          {{ copy().fields.contactEmail }}
          <span class="text-mm-ink-muted font-normal">({{ copy().fields.optional }})</span>
        </label>
        <input id="contactEmail" z-input type="email" class="mm-onboarding__input" formControlName="contactEmail" autocomplete="email" />
      </div>
    </form>
  `,
})
export class OnboardingLocationStepComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly regions = KUWAIT_REGIONS;
  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly form = this.fb.nonNullable.group({
    countryId: [this.facade.draft().location.countryId],
    regionId: [this.facade.draft().location.regionId],
    address: [this.facade.draft().location.address],
    contactPersonName: [this.facade.draft().location.contactPersonName],
    contactPhone: [this.facade.draft().location.contactPhone],
    contactEmail: [this.facade.draft().location.contactEmail],
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.facade.updateDraft('location', {
        countryId: value.countryId ?? 'kw',
        regionId: value.regionId ?? '',
        address: value.address ?? '',
        contactPersonName: value.contactPersonName ?? '',
        contactPhone: value.contactPhone ?? '',
        contactEmail: value.contactEmail ?? '',
      });
    });
  }
}
