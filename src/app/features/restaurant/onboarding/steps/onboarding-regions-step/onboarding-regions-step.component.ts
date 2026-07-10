import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';
import { SERVICE_AREA_OPTIONS } from '../../data/onboarding.defaults';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-regions-step',
  standalone: true,
  imports: [ReactiveFormsModule, ZardInputDirective],
  template: `
    <div class="flex flex-col gap-4">
      <form class="mm-onboarding__form" [formGroup]="form">
        <div class="mm-onboarding__field mm-onboarding__field--full">
          <label class="mm-onboarding__label" for="serviceRegionId">{{ copy().fields.serviceRegions }}</label>
          <select
            id="serviceRegionId"
            class="mm-onboarding__input mm-onboarding__select"
            formControlName="serviceRegionId"
          >
            <option value="">{{ facade.localeService.isRtl() ? 'اختر المنطقة' : 'Select region' }}</option>
            @for (area of areas; track area.id) {
              <option [value]="area.id">{{ facade.localeService.isRtl() ? area.ar : area.en }}</option>
            }
          </select>
        </div>

        <div class="mm-onboarding__field">
          <label class="mm-onboarding__label" for="bankName">{{ copy().fields.bankName }}</label>
          <input id="bankName" z-input class="mm-onboarding__input" formControlName="bankName" />
        </div>
        <div class="mm-onboarding__field">
          <label class="mm-onboarding__label" for="accountHolder">{{ copy().fields.accountHolder }}</label>
          <input id="accountHolder" z-input class="mm-onboarding__input" formControlName="accountHolder" />
        </div>
        <div class="mm-onboarding__field mm-onboarding__field--full">
          <label class="mm-onboarding__label" for="iban">{{ copy().fields.iban }}</label>
          <input id="iban" z-input class="mm-onboarding__input font-mono" formControlName="iban" dir="ltr" placeholder="KW00 XXXX 0000 0000 0000 0000 0000 00" />
        </div>
      </form>
    </div>
  `,
})
export class OnboardingRegionsStepComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly areas = SERVICE_AREA_OPTIONS;
  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly form = this.fb.nonNullable.group({
    serviceRegionId: [this.facade.draft().regions.serviceRegions[0] ?? ''],
    bankName: [this.facade.draft().regions.bankName],
    iban: [this.facade.draft().regions.iban],
    accountHolder: [this.facade.draft().regions.accountHolder],
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.facade.updateDraft('regions', {
        serviceRegions: value.serviceRegionId ? [value.serviceRegionId] : [],
        bankName: value.bankName ?? '',
        iban: value.iban ?? '',
        accountHolder: value.accountHolder ?? '',
      });
    });
  }
}
