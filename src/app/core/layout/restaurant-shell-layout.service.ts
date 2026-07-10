import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type RestaurantViewport = 'mobile' | 'tablet' | 'desktop' | 'wide';

const QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px) and (max-width: 1535px)',
  wide: '(min-width: 1536px)',
} as const;

@Injectable()
export class RestaurantShellLayoutService {
  private readonly destroyRef = inject(DestroyRef);

  readonly viewport = signal<RestaurantViewport>('desktop');
  readonly mobileNavOpen = signal(false);
  readonly userCollapsed = signal(false);

  readonly isMobile = computed(() => this.viewport() === 'mobile');
  readonly isTablet = computed(() => this.viewport() === 'tablet');
  readonly isDesktopUp = computed(() => {
    const v = this.viewport();
    return v === 'desktop' || v === 'wide';
  });

  readonly showBackdrop = computed(() => this.isMobile() && this.mobileNavOpen());

  constructor() {
    this.syncViewport();
    this.bindMedia(QUERIES.mobile, () => this.syncViewport());
    this.bindMedia(QUERIES.tablet, () => this.syncViewport());
    this.bindMedia(QUERIES.desktop, () => this.syncViewport());
    this.bindMedia(QUERIES.wide, () => this.syncViewport());
  }

  openMobileNav(): void {
    if (!this.isMobile()) {
      return;
    }

    this.mobileNavOpen.set(true);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  setUserCollapsed(collapsed: boolean): void {
    this.userCollapsed.set(collapsed);
  }

  toggleUserCollapsed(): void {
    this.userCollapsed.update((value) => !value);
  }

  onRouteChange(): void {
    if (this.isMobile()) {
      this.closeMobileNav();
    }
  }

  private syncViewport(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const next = this.resolveViewport();
    const prev = this.viewport();

    if (next === prev) {
      return;
    }

    this.viewport.set(next);

    if (next === 'mobile') {
      this.closeMobileNav();
    }
  }

  private resolveViewport(): RestaurantViewport {
    if (window.matchMedia(QUERIES.wide).matches) {
      return 'wide';
    }

    if (window.matchMedia(QUERIES.desktop).matches) {
      return 'desktop';
    }

    if (window.matchMedia(QUERIES.tablet).matches) {
      return 'tablet';
    }

    return 'mobile';
  }

  private bindMedia(query: string, handler: () => void): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(query);
    const listener = () => handler();

    media.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', listener));
  }
}
