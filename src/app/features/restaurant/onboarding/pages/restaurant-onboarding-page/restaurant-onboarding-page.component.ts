import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RestaurantAuthLocaleService } from '@/features/auth/state/auth-locale.service';
import { OnboardingStepperComponent } from '../../components/onboarding-stepper/onboarding-stepper.component';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';
import { OnboardingAccountStepComponent } from '../../steps/onboarding-account-step/onboarding-account-step.component';
import { OnboardingBusinessStepComponent } from '../../steps/onboarding-business-step/onboarding-business-step.component';
import { OnboardingDocumentsStepComponent } from '../../steps/onboarding-documents-step/onboarding-documents-step.component';
import { OnboardingLocationStepComponent } from '../../steps/onboarding-location-step/onboarding-location-step.component';
import { OnboardingOfferingsStepComponent } from '../../steps/onboarding-offerings-step/onboarding-offerings-step.component';
import { OnboardingRegionsStepComponent } from '../../steps/onboarding-regions-step/onboarding-regions-step.component';
import { OnboardingReviewStepComponent } from '../../steps/onboarding-review-step/onboarding-review-step.component';

@Component({
  selector: 'mm-restaurant-onboarding-page',
  standalone: true,
  imports: [
    RouterLink,
    ZardButtonComponent,
    OnboardingStepperComponent,
    OnboardingAccountStepComponent,
    OnboardingBusinessStepComponent,
    OnboardingOfferingsStepComponent,
    OnboardingLocationStepComponent,
    OnboardingDocumentsStepComponent,
    OnboardingRegionsStepComponent,
    OnboardingReviewStepComponent,
  ],
  templateUrl: './restaurant-onboarding-page.component.html',
  host: {
    class: 'block min-h-dvh',
    '[attr.dir]': 'localeService.dir()',
    '[attr.lang]': 'localeService.locale()',
  },
})
export class RestaurantOnboardingPageComponent {
  readonly facade = inject(RestaurantOnboardingFacade);
  readonly localeService = inject(RestaurantAuthLocaleService);

  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly brandLogoWhiteSrc = BRAND_ASSETS.white;
  readonly authHeroSrc = 'assets/images/auth/restaurant-hero.png';
  readonly copy = computed(() => ONBOARDING_I18N[this.localeService.locale()]);
  readonly currentStepCopy = computed(() => this.copy().steps[this.facade.currentStep()]);
  readonly brandTagline = computed(() =>
    this.localeService.isRtl()
      ? { lead: 'أكل صحي', accent: 'شراكة موثوقة' }
      : { lead: 'Healthy meals', accent: 'Trusted partnership' }
  );
}
