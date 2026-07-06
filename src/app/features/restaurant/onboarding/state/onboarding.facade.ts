import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AUTH_DESIGN_MODE } from '@/features/auth/config/auth-design.config';
import { RestaurantAuthLocaleService } from '@/features/auth/state/auth-locale.service';
import { createEmptyDraft } from '../data/onboarding.defaults';
import { ONBOARDING_STEPS } from '../data/onboarding.defaults';
import type { OnboardingStepId, OnboardingViewState, RestaurantOnboardingDraft } from '../models/onboarding.model';

@Injectable()
export class RestaurantOnboardingFacade {
  private readonly router = inject(Router);
  readonly localeService = inject(RestaurantAuthLocaleService);

  readonly currentStep = signal<OnboardingStepId>('account');
  readonly draft = signal<RestaurantOnboardingDraft>(createEmptyDraft());
  readonly viewState = signal<OnboardingViewState>('editing');
  readonly completedSteps = signal<Set<OnboardingStepId>>(new Set());

  readonly steps = ONBOARDING_STEPS;
  readonly currentStepIndex = computed(() =>
    this.steps.findIndex((step) => step.id === this.currentStep())
  );
  readonly progressPercent = computed(() =>
    Math.round(((this.currentStepIndex() + 1) / this.steps.length) * 100)
  );
  readonly isFirstStep = computed(() => this.currentStepIndex() === 0);
  readonly isLastStep = computed(() => this.currentStepIndex() === this.steps.length - 1);
  readonly isSubmitting = computed(() => this.viewState() === 'submitting');
  readonly isSubmitted = computed(() => this.viewState() === 'submitted');

  updateDraft<K extends keyof RestaurantOnboardingDraft>(
    section: K,
    value: RestaurantOnboardingDraft[K]
  ): void {
    this.draft.update((current) => ({ ...current, [section]: value }));
  }

  markDocumentUploaded(documentId: string, fileName: string): void {
    this.draft.update((current) => ({
      ...current,
      documents: current.documents.map((doc) =>
        doc.id === documentId ? { ...doc, uploaded: true, fileName } : doc
      ),
    }));
  }

  toggleServiceRegion(regionId: string): void {
    this.draft.update((current) => {
      const selected = new Set(current.regions.serviceRegions);
      if (selected.has(regionId)) {
        selected.delete(regionId);
      } else {
        selected.add(regionId);
      }
      return {
        ...current,
        regions: { ...current.regions, serviceRegions: [...selected] },
      };
    });
  }

  goNext(): void {
    if (this.isLastStep()) {
      this.submit();
      return;
    }

    this.markStepComplete(this.currentStep());
    const next = this.steps[this.currentStepIndex() + 1];
    if (next) {
      this.currentStep.set(next.id);
    }
  }

  goBack(): void {
    if (this.isFirstStep()) {
      return;
    }
    const prev = this.steps[this.currentStepIndex() - 1];
    if (prev) {
      this.currentStep.set(prev.id);
    }
  }

  goToStep(stepId: OnboardingStepId): void {
    const targetIndex = this.steps.findIndex((step) => step.id === stepId);
    const currentIndex = this.currentStepIndex();
    if (targetIndex <= currentIndex || AUTH_DESIGN_MODE) {
      this.currentStep.set(stepId);
    }
  }

  saveDraft(): void {
    // Design phase — local persistence placeholder
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mm-restaurant-onboarding-draft', JSON.stringify(this.draft()));
    }
  }

  submit(): void {
    this.viewState.set('submitting');
    setTimeout(() => {
      this.viewState.set('submitted');
      this.markStepComplete('review');
    }, AUTH_DESIGN_MODE ? 600 : 1200);
  }

  isStepComplete(stepId: OnboardingStepId): boolean {
    return this.completedSteps().has(stepId);
  }

  isStepAccessible(stepId: OnboardingStepId): boolean {
    if (AUTH_DESIGN_MODE) {
      return true;
    }
    const targetIndex = this.steps.findIndex((step) => step.id === stepId);
    return targetIndex <= this.currentStepIndex();
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/restaurant/login');
  }

  private markStepComplete(stepId: OnboardingStepId): void {
    this.completedSteps.update((set) => new Set([...set, stepId]));
  }
}
