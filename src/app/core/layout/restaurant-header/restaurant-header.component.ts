import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideGlobe, lucideMenu } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RestaurantShellLayoutService } from '@/core/layout/restaurant-shell-layout.service';

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
      lucideGlobe,
      lucideMenu,
    }),
  ],
})
export class RestaurantHeaderComponent {
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(RestaurantShellLayoutService);

  readonly brandLogoSrc = BRAND_ASSETS.full;

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المطعم' : 'Restaurant Panel',
  );

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

  readonly todayLabel = computed(() => {
    const date = new Date();
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  });

  openMobileNav(): void {
    this.layout.openMobileNav();
  }
}
