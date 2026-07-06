/** Shared page UX state for loading / empty / error / success. */
export type PageViewState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface PageStateModel {
  viewState: PageViewState;
  errorMessage?: string;
}
