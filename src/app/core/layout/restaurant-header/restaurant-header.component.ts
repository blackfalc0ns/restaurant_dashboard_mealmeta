import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCalendarDays,
  lucideCheck,
  lucideChevronDown,
  lucideGlobe,
  lucideMenu,
} from '@ng-icons/lucide';
import { filter } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RestaurantShellLayoutService } from '@/core/layout/restaurant-shell-layout.service';
import {
  RESTAURANT_NAV_SECTIONS,
  RESTAURANT_SETTINGS_ITEM,
} from '@/core/navigation/restaurant-nav.config';
import { RestaurantNavItem } from '@/core/navigation/restaurant-nav.model';

@Component({
  selector: 'mm-restaurant-header',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './restaurant-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0',
  },
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideCalendarDays,
      lucideCheck,
      lucideChevronDown,
      lucideGlobe,
      lucideMenu,
    }),
  ],
})
export class RestaurantHeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(RestaurantShellLayoutService);
  readonly currentUrl = signal(this.router.url);

  readonly brandLogoSrc = BRAND_ASSETS.full;

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المطعم' : 'Restaurant Panel',
  );

  readonly pageTitle = computed(() => {
    const item = this.resolveCurrentItem(this.currentUrl());
    if (!item) return this.locale.isRtl() ? 'الرئيسية' : 'Overview';
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  });

  readonly langSwitchLabel = computed(() =>
    this.locale.locale() === 'ar' ? 'English' : 'العربية',
  );

  readonly menuLabel = computed(() =>
    this.locale.isRtl() ? 'فتح القائمة' : 'Open menu',
  );

  readonly restaurantName = computed(() =>
    this.locale.isRtl() ? 'مطعمي' : 'My Restaurant',
  );

  readonly restaurantRole = computed(() =>
    this.locale.isRtl() ? 'شريك MealMate' : 'MealMate Partner',
  );

  readonly operationalStatus = computed(() =>
    this.locale.isRtl() ? 'جاهز لاستقبال الطلبات' : 'Ready for orders',
  );

  readonly todayLabel = computed(() => {
    const date = new Date();
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));
  }

  openMobileNav(): void {
    this.layout.openMobileNav();
  }

  private resolveCurrentItem(url: string): RestaurantNavItem | null {
    const path = url.split('?')[0];
    const items = [
      ...RESTAURANT_NAV_SECTIONS.flatMap((section) => this.flattenItems(section.items)),
      RESTAURANT_SETTINGS_ITEM,
    ];

    return items
      .filter((item) => {
        const itemPath = item.route?.split('?')[0];
        return !!itemPath && (path === itemPath || path.startsWith(itemPath + '/'));
      })
      .sort((a, b) => (b.route?.length ?? 0) - (a.route?.length ?? 0))[0] ?? null;
  }

  private flattenItems(items: RestaurantNavItem[]): RestaurantNavItem[] {
    return items.flatMap((item) => item.children?.length ? this.flattenItems(item.children) : [item]);
  }
}
