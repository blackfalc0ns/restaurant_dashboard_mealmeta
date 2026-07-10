import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCircleDashed,
  lucideSparkles,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import { OverviewStatusBanner } from '../../models/restaurant-overview.model';
import { pickLocale } from '../../overview-i18n';

@Component({
  selector: 'mm-overview-status-banner',
  standalone: true,
  imports: [NgIcon, RouterLink],
  templateUrl: './overview-status-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ov-banner block',
    '[class.is-busy]': 'banner().status === "busy"',
    '[class.is-setup]': 'banner().status === "needs_setup"',
  },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideCircleDashed,
      lucideSparkles,
    }),
  ],
})
export class OverviewStatusBannerComponent {
  readonly banner = input.required<OverviewStatusBanner>();
  readonly restaurantName = input.required<{ ar: string; en: string }>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() => pickLocale(this.banner().title, this.locale.locale()));
  readonly subtitle = computed(() =>
    pickLocale(this.banner().subtitle, this.locale.locale()),
  );
  readonly name = computed(() =>
    pickLocale(this.restaurantName(), this.locale.locale()),
  );
  readonly greeting = computed(() =>
    this.locale.isRtl() ? 'مرحباً' : 'Welcome',
  );
  readonly checklistTitle = computed(() =>
    this.locale.isRtl() ? 'جاهزية التشغيل' : 'Operational readiness',
  );
  readonly opsLinkLabel = computed(() =>
    this.locale.isRtl() ? 'تشغيل اليوم' : 'Daily operations',
  );

  itemLabel(label: { ar: string; en: string }): string {
    return pickLocale(label, this.locale.locale());
  }
}
