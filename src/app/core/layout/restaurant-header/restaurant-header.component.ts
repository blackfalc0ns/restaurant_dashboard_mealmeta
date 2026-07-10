import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCalendarDays,
  lucideCircleCheck,
  lucideGlobe,
  lucideMenu,
} from '@ng-icons/lucide';

import { RestaurantAuthStore } from '@/core/auth/restaurant-auth.store';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { RestaurantShellLayoutService } from '@/core/layout/restaurant-shell-layout.service';
import {
  RESTAURANT_NAV_SECTIONS,
  RESTAURANT_SETTINGS_ITEM,
} from '@/core/navigation/restaurant-nav.config';

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
      lucideCircleCheck,
      lucideGlobe,
      lucideMenu,
    }),
  ],
})
export class RestaurantHeaderComponent {
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(RestaurantShellLayoutService);
  private readonly authStore = inject(RestaurantAuthStore);
  private readonly router = inject(Router);

  readonly brandLogoSrc = BRAND_ASSETS.wordmark;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly pageMeta = computed(() => {
    const url = this.currentUrl().split('?')[0];
    const rtl = this.locale.isRtl();

    if (url === RESTAURANT_SETTINGS_ITEM.route || url.startsWith(`${RESTAURANT_SETTINGS_ITEM.route}/`)) {
      return {
        section: rtl ? 'الإعدادات' : 'Settings',
        page: rtl ? RESTAURANT_SETTINGS_ITEM.labelAr : RESTAURANT_SETTINGS_ITEM.labelEn,
      };
    }

    for (const section of RESTAURANT_NAV_SECTIONS) {
      for (const item of section.items) {
        if (url === item.route || url.startsWith(`${item.route}/`)) {
          return {
            section: rtl ? section.labelAr : section.labelEn,
            page: rtl ? item.labelAr : item.labelEn,
          };
        }
      }
    }

    return {
      section: rtl ? 'لوحة المطعم' : 'Restaurant panel',
      page: rtl ? 'نظرة عامة' : 'Overview',
    };
  });

  readonly langSwitchLabel = computed(() =>
    this.locale.locale() === 'ar' ? 'English' : 'العربية',
  );

  readonly menuLabel = computed(() =>
    this.locale.isRtl() ? 'فتح القائمة' : 'Open menu',
  );

  readonly notificationsLabel = computed(() =>
    this.locale.isRtl() ? 'الإشعارات' : 'Notifications',
  );

  readonly statusLabel = computed(() =>
    this.locale.isRtl() ? 'حالة المطعم' : 'Restaurant status',
  );

  readonly statusValue = computed(() => {
    const approved = this.authStore.isApproved();
    if (!approved) {
      return this.locale.isRtl() ? 'بانتظار الاعتماد' : 'Pending approval';
    }
    if (!this.authStore.hasApprovedMenu() || !this.authStore.hasServiceArea()) {
      return this.locale.isRtl() ? 'يحتاج إعداد تشغيلي' : 'Needs setup';
    }
    return this.locale.isRtl() ? 'نشط' : 'Active';
  });

  readonly restaurantName = computed(() =>
    this.locale.isRtl() ? 'مطعم الشريك' : 'Partner Restaurant',
  );

  readonly restaurantRole = computed(() =>
    this.locale.isRtl() ? 'مالك المطعم' : 'Restaurant owner',
  );

  readonly avatarLetter = computed(() =>
    this.locale.isRtl() ? 'م' : 'P',
  );

  readonly todayLabel = computed(() => {
    const date = new Date();
    return new Intl.DateTimeFormat(
      this.locale.locale() === 'ar' ? 'ar-EG' : 'en-US',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      },
    ).format(date);
  });

  openMobileNav(): void {
    this.layout.openMobileNav();
  }
}
