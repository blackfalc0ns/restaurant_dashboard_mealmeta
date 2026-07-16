import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  DispatchOfficer,
  DispatchOfficerCreateDraft,
  DispatchOfficerFilter,
  DispatchOfficerStatus,
  DispatchOfficersData,
} from '../models/dispatch-officer.model';
import { DISPATCH_OFFICERS_MOCK } from './dispatch-officers.mock';

export const DISPATCH_OFFICERS_PAGE_SIZE = 8;

@Injectable({ providedIn: 'root' })
export class DispatchOfficersFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<DispatchOfficersData | null>(null);
  readonly filter = signal<DispatchOfficerFilter>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly togglingId = signal<string | null>(null);
  readonly creating = signal(false);
  readonly createError = signal<string | null>(null);
  readonly pageSize = DISPATCH_OFFICERS_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;
  private createTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredOfficers = computed<DispatchOfficer[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const query = this.search().trim().toLowerCase();

    return data.officers.filter((officer) => {
      if (filter !== 'all' && officer.status !== filter) return false;
      if (!query) return true;

      const haystack = [
        officer.name.ar,
        officer.name.en,
        officer.phone,
        officer.email,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<DispatchOfficerFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, active: 0, invited: 0, disabled: 0 };
    if (!data) return empty;

    return {
      all: data.officers.length,
      active: data.officers.filter((o) => o.status === 'active').length,
      invited: data.officers.filter((o) => o.status === 'invited').length,
      disabled: data.officers.filter((o) => o.status === 'disabled').length,
    };
  });

  readonly totalPages = computed(() => {
    const total = this.filteredOfficers().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedOfficers = computed(() => {
    const items = this.filteredOfficers();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredOfficers().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  load(): void {
    this.clearLoadTimer();

    if (this.data()) {
      this.page.set({ viewState: 'success' });
      return;
    }

    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(DISPATCH_OFFICERS_MOCK);
      this.syncSummaries(mock);
      this.data.set(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 650);
  }

  ensureLoaded(): void {
    this.load();
  }

  setFilter(filter: DispatchOfficerFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  nextPage(): void {
    this.setPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.setPage(this.currentPage() - 1);
  }

  goToPage(page: number): void {
    this.setPage(page);
  }

  officerById(id: string): DispatchOfficer | null {
    return this.data()?.officers.find((officer) => officer.id === id) ?? null;
  }

  toggleEnabled(officerId: string): void {
    const data = this.data();
    if (!data || this.togglingId()) return;

    const target = data.officers.find((o) => o.id === officerId);
    if (!target) return;
    if (target.status !== 'active' && target.status !== 'disabled') return;

    this.togglingId.set(officerId);
    this.clearToggleTimer();

    this.toggleTimer = setTimeout(() => {
      const current = this.data();
      if (!current) return;

      const officer = current.officers.find((o) => o.id === officerId);
      if (!officer) {
        this.togglingId.set(null);
        this.toggleTimer = null;
        return;
      }

      const enabling = officer.status === 'disabled';
      const nextStatus: DispatchOfficerStatus = enabling ? 'active' : 'disabled';

      const officers: DispatchOfficer[] = current.officers.map((item) => {
        if (item.id !== officerId) return item;
        return {
          ...item,
          status: nextStatus,
          updatedAtLabel: {
            ar: enabling ? 'تم التفعيل للتو' : 'تم التعطيل للتو',
            en: enabling ? 'Enabled just now' : 'Disabled just now',
          },
          note: enabling
            ? undefined
            : {
                ar: 'معطّل من المطعم — لا يمكنه إنشاء رحلات من التطبيق.',
                en: 'Disabled by the restaurant — cannot create trips from the app.',
              },
          timeline: [
            {
              id: `evt-${Date.now()}`,
              title: {
                ar: enabling
                  ? 'المطعم فعّل حساب مسئول التوصيل'
                  : 'المطعم عطّل حساب مسئول التوصيل',
                en: enabling
                  ? 'Restaurant enabled the dispatch account'
                  : 'Restaurant disabled the dispatch account',
              },
              timeLabel: { ar: 'الآن', en: 'Just now' },
              tone: enabling ? 'ok' : 'danger',
            },
            ...item.timeline,
          ],
        };
      });

      const next = { ...current, officers };
      this.syncSummaries(next);
      this.data.set(next);
      this.togglingId.set(null);
      this.toggleTimer = null;
    }, 420);
  }

  createOfficer(
    draft: DispatchOfficerCreateDraft,
    onDone: (officerId: string) => void,
  ): void {
    const data = this.data();
    if (!data || this.creating()) return;

    const nameAr = draft.nameAr.trim();
    const nameEn = draft.nameEn.trim() || nameAr;
    const phone = draft.phone.trim();
    const email = draft.email.trim();

    if (!nameAr || !phone || !email) {
      this.createError.set('missing');
      return;
    }

    this.creating.set(true);
    this.createError.set(null);
    this.clearCreateTimer();

    this.createTimer = setTimeout(() => {
      const current = this.data();
      if (!current) {
        this.creating.set(false);
        return;
      }

      const id = `dsp-${String(current.officers.length + 10).padStart(2, '0')}`;
      const officer: DispatchOfficer = {
        id,
        name: { ar: nameAr, en: nameEn },
        phone,
        email,
        status: 'invited',
        tripsCreatedToday: 0,
        tripsCreatedWeek: 0,
        updatedAtLabel: { ar: 'دُعي للتو', en: 'Invited just now' },
        joinedAtLabel: { ar: 'أُنشئ الآن', en: 'Created just now' },
        note: {
          ar: 'بانتظار أول دخول لتطبيق مسئول التوصيل.',
          en: 'Awaiting first login to the dispatch mobile app.',
        },
        timeline: [
          {
            id: `evt-${Date.now()}`,
            title: {
              ar: 'المطعم أنشأ الحساب وأرسل الدعوة',
              en: 'Restaurant created the account and sent the invite',
            },
            timeLabel: { ar: 'الآن', en: 'Just now' },
            tone: 'warn',
          },
        ],
      };

      const next = {
        ...current,
        officers: [officer, ...current.officers],
      };
      this.syncSummaries(next);
      this.data.set(next);
      this.creating.set(false);
      this.createTimer = null;
      onDone(id);
    }, 520);
  }

  retry(): void {
    this.data.set(null);
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearToggleTimer();
    this.clearCreateTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.togglingId.set(null);
    this.creating.set(false);
    this.createError.set(null);
  }

  private syncSummaries(data: DispatchOfficersData): void {
    data.summaries = [
      {
        id: 'active',
        label: { ar: 'مفعّلون', en: 'Active' },
        value: data.officers.filter((o) => o.status === 'active').length,
      },
      {
        id: 'invited',
        label: { ar: 'مدعوّون', en: 'Invited' },
        value: data.officers.filter((o) => o.status === 'invited').length,
      },
      {
        id: 'disabled',
        label: { ar: 'معطّلون', en: 'Disabled' },
        value: data.officers.filter((o) => o.status === 'disabled').length,
      },
    ];
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearToggleTimer(): void {
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
  }

  private clearCreateTimer(): void {
    if (this.createTimer) {
      clearTimeout(this.createTimer);
      this.createTimer = null;
    }
  }
}
