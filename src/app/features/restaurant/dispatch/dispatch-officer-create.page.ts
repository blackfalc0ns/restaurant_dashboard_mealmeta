import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideClipboardList,
  lucideLoaderCircle,
  lucideSmartphone,
  lucideTriangleAlert,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsDetailHeroComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { DispatchOfficersFacade } from './data/dispatch-officers.facade';
import { DispatchOfficersSkeletonComponent } from './dispatch-officers-skeleton.component';

@Component({
  selector: 'mm-dispatch-officer-create-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DispatchOfficersSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsBoardComponent,
  ],
  templateUrl: './dispatch-officer-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-dsp-create-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideClipboardList,
      lucideLoaderCircle,
      lucideSmartphone,
      lucideTriangleAlert,
    }),
  ],
})
export class DispatchOfficerCreatePageComponent implements OnInit {
  readonly facade = inject(DispatchOfficersFacade);
  readonly locale = inject(AppLocaleService);
  private readonly router = inject(Router);

  readonly nameAr = signal('');
  readonly nameEn = signal('');
  readonly phone = signal('');
  readonly email = signal('');

  readonly canSubmit = computed(
    () =>
      !!this.nameAr().trim() &&
      !!this.phone().trim() &&
      !!this.email().trim() &&
      !this.facade.creating(),
  );

  readonly errorMessage = computed(() => {
    if (this.facade.createError() !== 'missing') return '';
    return this.locale.isRtl()
      ? 'أدخل الاسم والهاتف والبريد.'
      : 'Enter name, phone, and email.';
  });

  ngOnInit(): void {
    this.facade.ensureLoaded();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  submit(): void {
    this.facade.createOfficer(
      {
        nameAr: this.nameAr(),
        nameEn: this.nameEn(),
        phone: this.phone(),
        email: this.email(),
      },
      (id) => {
        void this.router.navigate(['/restaurant/delivery/dispatch', id]);
      },
    );
  }
}
