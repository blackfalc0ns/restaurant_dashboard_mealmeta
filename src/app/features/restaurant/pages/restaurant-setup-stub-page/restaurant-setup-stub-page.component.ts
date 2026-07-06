import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mm-restaurant-setup-stub-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-6 py-10 text-center">
      <h1 class="text-2xl font-extrabold text-emerald-950">إعداد المطعم</h1>
      <p class="text-sm leading-relaxed text-slate-600">
        حسابك يحتاج إكمال الاعتماد أو المنيو أو نطاق الخدمة قبل بدء استقبال الطلبات.
      </p>
      <a
        routerLink="/restaurant/login"
        class="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white"
      >
        العودة لتسجيل الدخول
      </a>
    </section>
  `,
})
export class RestaurantSetupStubPageComponent {}
