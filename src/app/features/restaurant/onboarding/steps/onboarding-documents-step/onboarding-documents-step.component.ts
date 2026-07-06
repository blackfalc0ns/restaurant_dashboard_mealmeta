import { Component, computed, inject } from '@angular/core';

import { ONBOARDING_I18N } from '../../i18n/onboarding.i18n';
import { RestaurantOnboardingFacade } from '../../state/onboarding.facade';

@Component({
  selector: 'mm-onboarding-documents-step',
  standalone: true,
  template: `
    <div class="mm-onboarding__form">
      @for (doc of facade.draft().documents; track doc.id) {
        <div
          class="mm-onboarding__doc-card"
          [class.mm-onboarding__doc-card--uploaded]="doc.uploaded"
        >
          <div class="flex items-start gap-3">
            <div class="mm-onboarding__doc-icon" aria-hidden="true">
              @if (doc.uploaded) {
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
                  <path d="M14 2v5h5M10 13h4M10 17h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
                </svg>
              }
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <p class="m-0 text-sm font-extrabold text-stone-800">
                  {{ facade.localeService.isRtl() ? doc.labelAr : doc.labelEn }}
                </p>
                @if (doc.uploaded) {
                  <span class="mm-onboarding__doc-badge">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ copy().fields.uploaded }}
                  </span>
                }
              </div>
              <p class="m-0 mt-1 text-xs text-mm-ink-muted">
                @if (doc.required) {
                  <span class="font-bold text-[#04994E]">{{ facade.localeService.isRtl() ? 'إلزامي' : 'Required' }}</span>
                } @else {
                  {{ copy().fields.optional }}
                }
              </p>
              @if (doc.uploaded && doc.fileName) {
                <p class="m-0 mt-2 truncate text-xs font-medium text-stone-500" dir="ltr">{{ doc.fileName }}</p>
              } @else {
                <p class="m-0 mt-2 text-xs text-mm-ink-muted">{{ copy().fields.uploadHint }}</p>
              }
            </div>
          </div>

          <button type="button" class="mm-onboarding__doc-upload" (click)="upload(doc.id)">
            <span>{{ copy().fields.uploadAction }}</span>
            <span class="mm-onboarding__doc-upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 20h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      }
    </div>
  `,
})
export class OnboardingDocumentsStepComponent {
  readonly facade = inject(RestaurantOnboardingFacade);
  readonly copy = computed(() => ONBOARDING_I18N[this.facade.localeService.locale()]);

  upload(documentId: string): void {
    this.facade.markDocumentUploaded(documentId, `document-${documentId}.pdf`);
  }
}
