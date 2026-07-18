import { Component, computed, inject } from '@angular/core';

import {
  KUWAIT_REGIONS,
  ONBOARDING_BUNDLE_OPTIONS,
  ONBOARDING_PROGRAM_OPTIONS,
  SERVICE_AREA_OPTIONS,
} from '../../data/onboarding.defaults';
import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-review-step',
  standalone: true,
  template: `
    <div class="flex flex-col gap-3">
      @for (section of sections(); track section.title) {
        <div class="mm-onboarding__review-card">
          <h3 class="mm-onboarding__review-title">{{ section.title }}</h3>
          <dl class="m-0 grid gap-x-3.5 gap-y-2 sm:grid-cols-2">
            @for (item of section.items; track item.label) {
              <div class="min-w-0" [class.sm:col-span-2]="!!item.full">
                <dt class="text-[0.7rem] font-semibold text-mm-ink-muted">{{ item.label }}</dt>
                <dd
                  class="m-0 truncate text-sm font-bold text-stone-800"
                  [class.text-mm-ink-muted]="!item.value"
                  [attr.dir]="item.ltr ? 'ltr' : null"
                >
                  {{ item.value || '—' }}
                </dd>
              </div>
            }
          </dl>
        </div>
      }
    </div>
  `,
})
export class OnboardingReviewStepComponent {
  readonly facade = inject(RestaurantOnboardingFacade);
  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  readonly sections = computed(() => {
    const c = this.copy();
    const d = this.facade.draft();
    const rtl = this.facade.localeService.isRtl();

    const region = KUWAIT_REGIONS.find((r) => r.id === d.location.regionId);
    const regionLabel = region ? (rtl ? region.ar : region.en) : '';

    const areas = d.regions.serviceRegions
      .map((id) => SERVICE_AREA_OPTIONS.find((a) => a.id === id))
      .filter(Boolean)
      .map((a) => (rtl ? a!.ar : a!.en))
      .join(rtl ? '، ' : ', ');

    const programs = d.offerings.programIds
      .map((id) => ONBOARDING_PROGRAM_OPTIONS.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => (rtl ? p!.ar : p!.en))
      .join(rtl ? '، ' : ', ');

    const bundles = d.offerings.bundleIds
      .map((id) => ONBOARDING_BUNDLE_OPTIONS.find((b) => b.id === id))
      .filter(Boolean)
      .map((b) => (rtl ? b!.ar : b!.en))
      .join(rtl ? '، ' : ', ');

    const comboCount = d.offerings.programIds.length * d.offerings.bundleIds.length;
    const comboLabel =
      comboCount > 0
        ? rtl
          ? `${comboCount} بوكس للتسعير لاحقاً`
          : `${comboCount} box${comboCount === 1 ? '' : 'es'} to price later`
        : '';

    const uploadedDocs = d.documents.filter((doc) => doc.uploaded).length;

    type ReviewItem = {
      label: string;
      value: string;
      ltr?: boolean;
      full?: boolean;
    };

    type ReviewSection = {
      title: string;
      items: ReviewItem[];
    };

    const sections: ReviewSection[] = [
      {
        title: c.fields.reviewSectionAccount,
        items: [
          { label: c.fields.email, value: d.account.email, ltr: true, full: false },
          { label: c.fields.phone, value: d.account.phone, ltr: true, full: false },
        ],
      },
      {
        title: c.fields.reviewSectionBusiness,
        items: [
          { label: c.fields.restaurantName, value: d.business.restaurantName, full: false },
          { label: c.fields.legalCompanyName, value: d.business.legalCompanyName, full: false },
          {
            label: c.fields.crNumber,
            value: d.business.commercialRegistrationNumber,
            ltr: true,
            full: false,
          },
          { label: c.fields.ownerName, value: d.business.ownerName, full: false },
        ],
      },
      {
        title: c.fields.reviewSectionOfferings,
        items: [
          { label: c.fields.programs, value: programs, full: true },
          { label: c.fields.bundles, value: bundles, full: true },
          {
            label: rtl ? 'التركيبات' : 'Combinations',
            value: comboLabel,
            full: true,
          },
        ],
      },
      {
        title: c.fields.reviewSectionLocation,
        items: [
          { label: c.fields.region, value: regionLabel, full: false },
          { label: c.fields.address, value: d.location.address, full: false },
          { label: c.fields.contactPerson, value: d.location.contactPersonName, full: false },
          {
            label: c.fields.contactPhone,
            value: d.location.contactPhone,
            ltr: true,
            full: false,
          },
        ],
      },
      {
        title: c.fields.reviewSectionDocuments,
        items: [
          {
            label: c.fields.reviewSectionDocuments,
            value: rtl
              ? `${uploadedDocs} / ${d.documents.length} مرفوعة`
              : `${uploadedDocs} / ${d.documents.length} uploaded`,
            full: false,
          },
        ],
      },
      {
        title: c.fields.reviewSectionRegions,
        items: [
          { label: c.fields.serviceRegions, value: areas, full: false },
          { label: c.fields.bankName, value: d.regions.bankName, full: false },
          { label: c.fields.iban, value: d.regions.iban, ltr: true, full: false },
        ],
      },
    ];

    return sections;
  });
}
