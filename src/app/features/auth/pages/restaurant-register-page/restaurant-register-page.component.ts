import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RestaurantAuthFormCardComponent } from '../../layout/restaurant-auth-form-card.component';
import { RESTAURANT_REGISTER_I18N } from '../../i18n/register.i18n';
import { RestaurantAuthLocaleService } from '../../state/auth-locale.service';

@Component({
  selector: 'mm-restaurant-register-page',
  standalone: true,
  imports: [RouterLink, RestaurantAuthFormCardComponent],
  templateUrl: './restaurant-register-page.component.html',
})
export class RestaurantRegisterPageComponent {
  private readonly localeService = inject(RestaurantAuthLocaleService);

  readonly copy = computed(() => RESTAURANT_REGISTER_I18N[this.localeService.locale()]);
}
