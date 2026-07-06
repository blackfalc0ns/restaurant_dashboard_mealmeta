import { Component, computed, inject } from '@angular/core';

import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-stepper',
  standalone: true,
  template: `
    <nav class="mm-onboarding__timeline" aria-label="Onboarding steps">
      @for (step of facade.steps; track step.id; let i = $index; let last = $last) {
        <div
          class="mm-onboarding__timeline-item"
          [class.mm-onboarding__timeline-item--last]="last"
          [class.mm-onboarding__timeline-item--segment-done]="facade.isStepComplete(step.id)"
        >
          <button
            type="button"
            class="mm-onboarding__step"
            [class.mm-onboarding__step--active]="facade.currentStep() === step.id"
            [class.mm-onboarding__step--done]="facade.isStepComplete(step.id)"
            [class.mm-onboarding__step--accessible]="facade.isStepAccessible(step.id)"
            [class.mm-onboarding__step--last]="last"
            [disabled]="!facade.isStepAccessible(step.id)"
            (click)="facade.goToStep(step.id)"
          >
            <span class="mm-onboarding__step-marker">
              @if (facade.isStepComplete(step.id) && facade.currentStep() !== step.id) {
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              } @else {
                @switch (step.icon) {
                  @case ('user') {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  }
                  @case ('building') {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><path d="M4 21V7l8-4 8 4v14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  }
                  @case ('map') {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><path d="M9 18l-6-3V6l6 3 6-3 6 3v9l-6-3-6 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 6v12M15 3v12" stroke="currentColor" stroke-width="1.5"/></svg>
                  }
                  @case ('file') {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v5h5M10 13h4M10 17h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  }
                  @case ('globe') {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" stroke="currentColor" stroke-width="1.5"/></svg>
                  }
                  @default {
                    <svg class="size-4" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  }
                }
              }
            </span>
            <span class="min-w-0 flex-1 pt-1 text-start">
              <span class="mm-onboarding__step-title block leading-tight">{{ copy().steps[step.id].title }}</span>
              <span class="mm-onboarding__step-subtitle mt-0.5 block leading-snug">{{ copy().steps[step.id].subtitle }}</span>
            </span>
          </button>
        </div>
      }
    </nav>
  `,
})
export class OnboardingStepperComponent {
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);
}
