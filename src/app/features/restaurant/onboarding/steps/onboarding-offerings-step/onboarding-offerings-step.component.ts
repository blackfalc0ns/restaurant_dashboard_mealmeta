import { Component, computed, inject } from '@angular/core';

import {
  ONBOARDING_BUNDLE_OPTIONS,
  ONBOARDING_PROGRAM_OPTIONS,
} from '../../data/onboarding.defaults';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-offerings-step',
  standalone: true,
  template: `
    <div class="flex flex-col gap-5">
      <div>
        <p class="mm-onboarding__label mb-2.5">{{ copy().fields.programs }}</p>
        <div class="flex flex-wrap gap-2">
          @for (program of programs; track program.id) {
            <button
              type="button"
              class="mm-onboarding__chip"
              [class.mm-onboarding__chip--active]="isProgramSelected(program.id)"
              (click)="facade.toggleProgram(program.id)"
            >
              {{ facade.localeService.isRtl() ? program.ar : program.en }}
            </button>
          }
        </div>
        @if (facade.draft().offerings.programIds.length === 0) {
          <p class="m-0 mt-2 text-[0.75rem] font-medium text-mm-ink-muted">
            {{ copy().fields.offeringsHintPrograms }}
          </p>
        }
      </div>

      <div>
        <p class="mm-onboarding__label mb-2.5">{{ copy().fields.bundles }}</p>
        <div class="flex flex-col gap-2">
          @for (bundle of bundles; track bundle.id) {
            <button
              type="button"
              class="mm-onboarding__chip flex w-full flex-col items-start gap-0.5 rounded-xl px-4 py-3 text-start"
              [class.mm-onboarding__chip--active]="isBundleSelected(bundle.id)"
              (click)="facade.toggleBundle(bundle.id)"
            >
              <strong class="text-xs font-extrabold">
                {{ facade.localeService.isRtl() ? bundle.ar : bundle.en }}
              </strong>
              @if (bundleDetail(bundle); as detail) {
                <em class="text-[0.6875rem] font-medium not-italic" [class]="isBundleSelected(bundle.id) ? 'text-white/80' : 'text-stone-500'">{{ detail }}</em>
              }
            </button>
          }
        </div>
        @if (facade.draft().offerings.bundleIds.length === 0) {
          <p class="m-0 mt-2 text-[0.75rem] font-medium text-mm-ink-muted">
            {{ copy().fields.offeringsHintBundles }}
          </p>
        }
      </div>

      <div class="rounded-xl border border-[#d9ebe1] bg-[#f8fbf9] px-4 py-3">
        <p class="m-0 text-sm font-extrabold text-mm-secondary">
          {{ comboPreview() }}
        </p>
        <p class="m-0 mt-1 text-[0.75rem] font-medium leading-relaxed text-mm-ink-muted">
          {{ copy().fields.offeringsPricingNote }}
        </p>
      </div>
    </div>
  `,
})
export class OnboardingOfferingsStepComponent {
  readonly facade = inject(RestaurantOnboardingFacade);

  readonly programs = ONBOARDING_PROGRAM_OPTIONS;
  readonly bundles = ONBOARDING_BUNDLE_OPTIONS;
  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly comboPreview = computed(() => {
    const count = this.facade.comboCount();
    const c = this.copy();
    if (count === 0) {
      return c.fields.offeringsComboEmpty;
    }
    return this.facade.localeService.isRtl()
      ? `ستسعّر لاحقاً ${count} بوكس`
      : `You will price ${count} box${count === 1 ? '' : 'es'} later`;
  });

  isProgramSelected(id: string): boolean {
    return this.facade.draft().offerings.programIds.includes(id);
  }

  isBundleSelected(id: string): boolean {
    return this.facade.draft().offerings.bundleIds.includes(id);
  }

  bundleDetail(bundle: (typeof ONBOARDING_BUNDLE_OPTIONS)[number]): string {
    return this.facade.localeService.isRtl()
      ? (bundle.detailAr ?? '')
      : (bundle.detailEn ?? '');
  }
}
