import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  LabelJobItem,
  LabelsData,
  LabelsFilter,
  LabelsShift,
} from '../models/labels.model';
import { LABELS_MOCK } from './labels.mock';

export const LABELS_PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class LabelsFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<LabelsData | null>(null);
  readonly filter = signal<LabelsFilter>('all');
  readonly shift = signal<LabelsShift>('all');
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly printingId = signal<string | null>(null);
  readonly printingBatch = signal(false);
  readonly pageSize = LABELS_PAGE_SIZE;

  readonly filteredJobs = computed<LabelJobItem[]>(() => {
    const data = this.data();
    if (!data) return [];

    const filter = this.filter();
    const shift = this.shift();
    const query = this.search().trim().toLowerCase();

    return data.jobs.filter((job) => {
      if (filter !== 'all' && job.status !== filter) return false;
      if (shift !== 'all' && job.shift !== shift) return false;
      if (!query) return true;

      const haystack = [
        job.orderCode,
        job.batchCode,
        job.barcodeCode ?? '',
        job.mealLabel.ar,
        job.mealLabel.en,
        job.programLabel.ar,
        job.programLabel.en,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly filterCounts = computed<Record<LabelsFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, ready: 0, printed: 0, missing: 0 };
    if (!data) return empty;

    return {
      all: data.jobs.length,
      ready: data.jobs.filter((j) => j.status === 'ready').length,
      printed: data.jobs.filter((j) => j.status === 'printed').length,
      missing: data.jobs.filter((j) => j.status === 'missing').length,
    };
  });

  readonly readyCount = computed(
    () => this.data()?.jobs.filter((j) => j.status === 'ready').length ?? 0,
  );

  readonly totalPages = computed(() => {
    const total = this.filteredJobs().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  readonly pagedJobs = computed<LabelJobItem[]>(() => {
    const jobs = this.filteredJobs();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return jobs.slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly rangeLabel = computed(() => {
    const total = this.filteredJobs().length;
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const page = Math.min(this.currentPage(), this.totalPages());
    const from = (page - 1) * this.pageSize + 1;
    const to = Math.min(page * this.pageSize, total);
    return { from, to, total };
  });

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private printTimer: ReturnType<typeof setTimeout> | null = null;

  load(): void {
    this.clearLoadTimer();
    this.page.set({ viewState: 'loading' });
    this.currentPage.set(1);

    this.loadTimer = setTimeout(() => {
      const mock = structuredClone(LABELS_MOCK);
      this.data.set(mock);
      this.syncSummaries();
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 900);
  }

  setFilter(filter: LabelsFilter): void {
    this.filter.set(filter);
    this.currentPage.set(1);
  }

  setShift(shift: LabelsShift): void {
    this.shift.set(shift);
    this.currentPage.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  printJob(jobId: string): void {
    const data = this.data();
    if (!data || this.printingId() || this.printingBatch()) return;

    const target = data.jobs.find((job) => job.id === jobId);
    if (!target || target.status !== 'ready') return;

    this.printingId.set(jobId);
    this.clearPrintTimer();

    this.printTimer = setTimeout(() => {
      this.markPrinted([jobId]);
      this.printingId.set(null);
      this.printTimer = null;
    }, 650);
  }

  printReadyBatch(): void {
    const data = this.data();
    if (!data || this.printingId() || this.printingBatch()) return;

    const readyIds = data.jobs
      .filter((job) => job.status === 'ready')
      .map((job) => job.id);
    if (!readyIds.length) return;

    this.printingBatch.set(true);
    this.clearPrintTimer();

    this.printTimer = setTimeout(() => {
      this.markPrinted(readyIds);
      this.printingBatch.set(false);
      this.printTimer = null;
    }, 900);
  }

  retry(): void {
    this.load();
  }

  reset(): void {
    this.clearLoadTimer();
    this.clearPrintTimer();
    this.page.set({ viewState: 'idle' });
    this.data.set(null);
    this.filter.set('all');
    this.shift.set('all');
    this.search.set('');
    this.currentPage.set(1);
    this.printingId.set(null);
    this.printingBatch.set(false);
  }

  private markPrinted(jobIds: string[]): void {
    const idSet = new Set(jobIds);
    this.data.update((current) => {
      if (!current) return current;
      return {
        ...current,
        jobs: current.jobs.map((job) =>
          idSet.has(job.id)
            ? {
                ...job,
                status: 'printed' as const,
                printedAtLabel: {
                  ar: 'طُبع الآن',
                  en: 'Printed just now',
                },
              }
            : job,
        ),
      };
    });
    this.syncSummaries();
  }

  private syncSummaries(): void {
    this.data.update((current) => {
      if (!current) return current;
      const byId: Record<string, number> = {
        ready: current.jobs.filter((j) => j.status === 'ready').length,
        printed: current.jobs.filter((j) => j.status === 'printed').length,
        missing: current.jobs.filter((j) => j.status === 'missing').length,
        labels: current.jobs.reduce((sum, job) => sum + job.labelCount, 0),
      };

      return {
        ...current,
        summaries: current.summaries.map((card) => ({
          ...card,
          value: byId[card.id] ?? card.value,
        })),
      };
    });
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  private clearPrintTimer(): void {
    if (this.printTimer) {
      clearTimeout(this.printTimer);
      this.printTimer = null;
    }
  }
}
