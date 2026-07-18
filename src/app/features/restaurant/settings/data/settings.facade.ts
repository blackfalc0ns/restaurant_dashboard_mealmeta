import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  RestaurantSettingsData,
  SettingsAccountDraft,
  SettingsBusinessDraft,
  SettingsDocumentItem,
  SettingsLocationDraft,
  SettingsOfferingsDraft,
  SettingsRegionsDraft,
} from '../models/settings.model';
import { SETTINGS_MOCK } from './settings.mock';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantSettingsData | null>(null);
  readonly savedFlash = signal(false);
  readonly dirty = signal(false);

  private baseline: RestaurantSettingsData | null = null;
  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private flashTimer: ReturnType<typeof setTimeout> | null = null;

  readonly draft = computed(() => this.data()?.draft ?? null);

  readonly documentCounts = computed(() => {
    const items = this.draft()?.documents ?? [];
    return {
      all: items.length,
      uploaded: items.filter((item) => item.uploaded).length,
      missing: items.filter((item) => item.status === 'missing').length,
      expiring: items.filter((item) => item.status === 'expiring').length,
    };
  });

  readonly serviceRegionCount = computed(
    () => this.draft()?.regions.serviceRegions.length ?? 0,
  );

  load(): void {
    this.clearLoadTimer();

    const apply = () => {
      const clone = structuredClone(SETTINGS_MOCK);
      this.baseline = structuredClone(clone);
      this.data.set(clone);
      this.page.set({ viewState: 'success' });
      this.dirty.set(false);
    };

    if (this.data()) {
      apply();
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.loadTimer = setTimeout(() => {
      apply();
      this.loadTimer = null;
    }, 550);
  }

  ensureLoaded(): void {
    this.load();
  }

  retry(): void {
    this.data.set(null);
    this.baseline = null;
    this.load();
  }

  patchAccount(patch: Partial<SettingsAccountDraft>): void {
    this.patchDraft((draft) => {
      draft.account = { ...draft.account, ...patch };
    });
  }

  patchBusiness(patch: Partial<SettingsBusinessDraft>): void {
    this.patchDraft((draft) => {
      draft.business = { ...draft.business, ...patch };
    });
  }

  patchLocation(patch: Partial<SettingsLocationDraft>): void {
    this.patchDraft((draft) => {
      draft.location = { ...draft.location, ...patch };
    });
  }

  patchRegions(patch: Partial<SettingsRegionsDraft>): void {
    this.patchDraft((draft) => {
      draft.regions = { ...draft.regions, ...patch };
    });
  }

  patchOfferings(patch: Partial<SettingsOfferingsDraft>): void {
    this.patchDraft((draft) => {
      draft.offerings = { ...draft.offerings, ...patch };
    });
  }

  toggleProgram(programId: string): void {
    this.patchDraft((draft) => {
      const selected = new Set(draft.offerings.programIds);
      if (selected.has(programId)) selected.delete(programId);
      else selected.add(programId);
      draft.offerings.programIds = Array.from(selected);
    });
  }

  toggleBundle(bundleId: string): void {
    this.patchDraft((draft) => {
      const selected = new Set(draft.offerings.bundleIds);
      if (selected.has(bundleId)) selected.delete(bundleId);
      else selected.add(bundleId);
      draft.offerings.bundleIds = Array.from(selected);
    });
  }

  toggleServiceRegion(regionId: string): void {
    this.patchDraft((draft) => {
      const selected = new Set(draft.regions.serviceRegions);
      if (selected.has(regionId)) selected.delete(regionId);
      else selected.add(regionId);
      draft.regions.serviceRegions = Array.from(selected);
    });
  }

  setDocumentUploaded(docId: string, uploaded: boolean): void {
    this.patchDraft((draft) => {
      const doc = draft.documents.find((item) => item.id === docId);
      if (!doc) return;
      doc.uploaded = uploaded;
      if (uploaded) {
        doc.status = doc.status === 'missing' ? 'valid' : doc.status;
        doc.fileName = doc.fileName ?? `${doc.id}.pdf`;
      } else {
        doc.status = 'missing';
        doc.fileName = undefined;
      }
    });
  }

  setToggle(
    group: 'operations' | 'notifications',
    id: string,
    enabled: boolean,
  ): void {
    this.patchDraft((draft) => {
      const list =
        group === 'operations'
          ? draft.operationsToggles
          : draft.notificationToggles;
      const item = list.find((toggle) => toggle.id === id);
      if (item) item.enabled = enabled;
    });
  }

  setTwoFactor(enabled: boolean): void {
    this.patchDraft((draft) => {
      draft.security.twoFactorEnabled = enabled;
    });
  }

  revokeSession(sessionId: string): void {
    this.patchDraft((draft) => {
      draft.security.sessions = draft.security.sessions.filter(
        (session) => session.id !== sessionId || session.current,
      );
    });
  }

  save(): void {
    const data = this.data();
    if (!data) return;
    this.baseline = structuredClone(data);
    this.dirty.set(false);
    this.savedFlash.set(true);
    if (this.flashTimer) clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => {
      this.savedFlash.set(false);
      this.flashTimer = null;
    }, 1800);
  }

  discard(): void {
    if (!this.baseline) return;
    this.data.set(structuredClone(this.baseline));
    this.dirty.set(false);
    this.savedFlash.set(false);
  }

  private patchDraft(mutator: (draft: RestaurantSettingsData['draft']) => void): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    mutator(next.draft);
    this.data.set(next);
    this.dirty.set(true);
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }
}

export type { SettingsDocumentItem };
