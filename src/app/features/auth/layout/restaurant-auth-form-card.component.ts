import { Component, input } from '@angular/core';

@Component({
  selector: 'mm-restaurant-auth-form-card',
  standalone: true,
  template: `
    <div class="mm-restaurant-auth__card overflow-hidden rounded-2xl">
      <div class="p-5 sm:p-7">
        <div class="mb-5">
          <h1
            class="mb-1.5 text-[1.45rem] font-extrabold leading-snug text-mm-emerald sm:text-[1.7rem] lg:text-[1.8rem]"
          >
            {{ title() }}
          </h1>
          <p class="text-[0.8125rem] leading-relaxed text-stone-600 sm:text-sm">
            {{ subtitle() }}
          </p>
        </div>

        <div class="mb-6 h-px bg-mm-field-border"></div>

        <ng-content />
      </div>
    </div>
  `,
})
export class RestaurantAuthFormCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
