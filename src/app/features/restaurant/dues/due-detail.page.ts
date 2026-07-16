import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBadgePercent,
  lucideHandCoins,
  lucideHistory,
  lucideInfo,
  lucidePackage,
  lucideReceipt,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsDetailHeroComponent,
  RestaurantOpsMainComponent,
  RestaurantOpsSideCardComponent,
  RestaurantOpsSideComponent,
  RestaurantOpsSplitComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { DuesFacade } from './data/dues.facade';
import { DuesSkeletonComponent } from './dues-skeleton.component';
import {
  DueDeliveryDay,
  DueKind,
  DueLine,
  DueStatus,
  DueTimelineEvent,
} from './models/dues.model';

@Component({
  selector: 'mm-due-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DuesSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsSplitComponent,
    RestaurantOpsMainComponent,
    RestaurantOpsSideComponent,
    RestaurantOpsSideCardComponent,
  ],
  templateUrl: './due-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-detail flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBadgePercent,
      lucideHandCoins,
      lucideHistory,
      lucideInfo,
      lucidePackage,
      lucideReceipt,
    }),
  ],
})
export class DueDetailPageComponent implements OnInit {
  readonly facade = inject(DuesFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly dueId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('dueId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('dueId') ?? '' },
  );

  readonly line = computed(() => {
    const id = this.dueId();
    if (!id || this.facade.page().viewState !== 'success') return null;
    return this.facade.lineById(id);
  });

  readonly notFound = computed(
    () =>
      this.facade.page().viewState === 'success' &&
      !!this.dueId() &&
      !this.line(),
  );

  readonly agreementRate = computed(
    () => this.facade.data()?.agreementRatePct ?? 15,
  );

  ngOnInit(): void {
    this.facade.ensureLoaded();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  title(line: DueLine): string {
    return pickLocale(line.title, this.locale.locale());
  }

  detail(line: DueLine): string {
    return pickLocale(line.detail, this.locale.locale());
  }

  period(line: DueLine): string {
    return pickLocale(line.periodLabel, this.locale.locale());
  }

  updatedAt(line: DueLine): string {
    return pickLocale(line.updatedAtLabel, this.locale.locale());
  }

  lineNote(line: DueLine): string {
    return line.note ? pickLocale(line.note, this.locale.locale()) : '';
  }

  eventTitle(event: DueTimelineEvent): string {
    return pickLocale(event.title, this.locale.locale());
  }

  eventTime(event: DueTimelineEvent): string {
    return pickLocale(event.timeLabel, this.locale.locale());
  }

  statusLabel(status: DueStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'pending':
        return rtl ? 'معلّق' : 'Pending';
      case 'scheduled':
        return rtl ? 'مجدول' : 'Scheduled';
      case 'paid':
        return rtl ? 'مدفوع' : 'Paid';
      case 'held':
        return rtl ? 'موقوف' : 'Held';
    }
  }

  kindLabel(kind: DueKind): string {
    const rtl = this.locale.isRtl();
    switch (kind) {
      case 'meal_payable':
        return rtl ? 'مستحق وجبات' : 'Meal payable';
      case 'commission':
        return rtl ? 'عمولة' : 'Commission';
      case 'net_settlement':
        return rtl ? 'صافي تسوية' : 'Net settlement';
    }
  }

  avgBoxPrice(line: DueLine): number {
    if (!line.boxesDelivered) return 0;
    return line.grossKd / line.boxesDelivered;
  }

  dayLabel(day: DueDeliveryDay): string {
    return pickLocale(day.dateLabel, this.locale.locale());
  }
}
