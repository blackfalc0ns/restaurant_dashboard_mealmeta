import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AppLocale } from './app-locale.model';

const STORAGE_KEY = 'mm-restaurant-locale';

@Injectable({ providedIn: 'root' })
export class AppLocaleService {
  private readonly doc = inject(DOCUMENT);

  readonly locale = signal<AppLocale>(this.readStored());
  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.dir() === 'rtl');

  constructor() {
    effect(() => {
      const html = this.doc.documentElement;
      html.setAttribute('dir', this.dir());
      html.setAttribute('lang', this.locale());
      this.persist(this.locale());
    });
  }

  toggle(): void {
    this.locale.update((current) => (current === 'ar' ? 'en' : 'ar'));
  }

  private readStored(): AppLocale {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'en' || stored === 'ar' ? stored : 'ar';
    } catch {
      return 'ar';
    }
  }

  private persist(locale: AppLocale): void {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore private browsing / storage blocks
    }
  }
}
