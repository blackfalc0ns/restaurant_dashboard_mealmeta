import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RESTAURANT_AUTH_BRAND_I18N } from '../i18n/auth-brand.i18n';
import { RestaurantAuthLocaleService } from '../state/auth-locale.service';

@Component({
  selector: 'mm-restaurant-auth-layout',
  standalone: true,
  imports: [RouterOutlet, ZardButtonComponent],
  templateUrl: './restaurant-auth-layout.component.html',
  host: {
    class: 'block min-h-dvh w-full overflow-x-hidden',
  },
})
export class RestaurantAuthLayoutComponent {
  readonly localeService = inject(RestaurantAuthLocaleService);

  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly authHeroSrc = 'assets/images/auth/restaurant-hero.png';
  readonly brandCopy = computed(() => RESTAURANT_AUTH_BRAND_I18N[this.localeService.locale()]);
}
