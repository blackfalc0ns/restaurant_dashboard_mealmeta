import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';

import type { RestaurantAuthLocale } from '../models/auth-locale.model';

@Injectable()
export class RestaurantAuthLocaleService implements OnDestroy {
  private readonly document = inject(DOCUMENT);

  readonly locale = signal<RestaurantAuthLocale>('ar');
  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.locale() === 'ar');

  constructor() {
    effect(() => {
      const html = this.document.documentElement;
      html.lang = this.locale();
      html.dir = this.dir();
    });
  }

  ngOnDestroy(): void {
    const html = this.document.documentElement;
    html.lang = 'ar';
    html.dir = 'rtl';
  }

  toggle(): void {
    this.locale.update((current) => (current === 'ar' ? 'en' : 'ar'));
  }
}
