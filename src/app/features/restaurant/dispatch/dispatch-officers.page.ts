import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClipboardList,
  lucideInfo,
  lucideLoaderCircle,
  lucideMail,
  lucidePause,
  lucidePhone,
  lucidePlay,
  lucidePlus,
  lucideRoute,
  lucideSearch,
  lucideSmartphone,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsPagerComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { DispatchOfficersFacade } from './data/dispatch-officers.facade';
import { DispatchOfficersSkeletonComponent } from './dispatch-officers-skeleton.component';
import {
  DispatchOfficer,
  DispatchOfficerFilter,
  DispatchOfficerStatus,
} from './models/dispatch-officer.model';

@Component({
  selector: 'mm-dispatch-officers-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    DispatchOfficersSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './dispatch-officers.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-dsp-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideInfo,
      lucideLoaderCircle,
      lucideMail,
      lucidePause,
      lucidePhone,
      lucidePlay,
      lucidePlus,
      lucideRoute,
      lucideSearch,
      lucideSmartphone,
    }),
  ],
})
export class DispatchOfficersPageComponent implements OnInit {
  readonly facade = inject(DispatchOfficersFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: {
    id: DispatchOfficerFilter;
    labelAr: string;
    labelEn: string;
  }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'مفعّل', labelEn: 'Active' },
    { id: 'invited', labelAr: 'مدعوّ', labelEn: 'Invited' },
    { id: 'disabled', labelAr: 'معطّل', labelEn: 'Disabled' },
  ];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly dateLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.dateLabel, this.locale.locale()) : '';
  });

  readonly note = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.note, this.locale.locale()) : '';
  });

  readonly searchPlaceholder = computed(() =>
    this.locale.isRtl()
      ? 'ابحث بالاسم أو الهاتف أو البريد...'
      : 'Search by name, phone, or email...',
  );

  readonly emptyLabel = computed(() =>
    this.locale.isRtl()
      ? 'لا يوجد مسئولو توصيل مطابقون.'
      : 'No matching dispatch officers.',
  );

  readonly rangeText = computed(() => {
    const range = this.facade.rangeLabel();
    if (range.total === 0) {
      return this.locale.isRtl() ? 'لا نتائج' : 'No results';
    }
    return this.locale.isRtl()
      ? `عرض ${range.from}–${range.to} من ${range.total}`
      : `Showing ${range.from}–${range.to} of ${range.total}`;
  });

  readonly prevLabel = computed(() =>
    this.locale.isRtl() ? 'السابق' : 'Previous',
  );

  readonly nextLabel = computed(() =>
    this.locale.isRtl() ? 'التالي' : 'Next',
  );

  ngOnInit(): void {
    this.facade.load();
  }

  onSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setFilter(filter: DispatchOfficerFilter): void {
    this.facade.setFilter(filter);
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  filterCount(id: DispatchOfficerFilter): number {
    return this.facade.filterCounts()[id] ?? 0;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  officerName(officer: DispatchOfficer): string {
    return pickLocale(officer.name, this.locale.locale());
  }

  updatedAt(officer: DispatchOfficer): string {
    return pickLocale(officer.updatedAtLabel, this.locale.locale());
  }

  officerNote(officer: DispatchOfficer): string {
    return officer.note ? pickLocale(officer.note, this.locale.locale()) : '';
  }

  statusLabel(status: DispatchOfficerStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'active':
        return rtl ? 'مفعّل' : 'Active';
      case 'disabled':
        return rtl ? 'معطّل' : 'Disabled';
      case 'invited':
        return rtl ? 'مدعوّ' : 'Invited';
    }
  }

  canToggle(officer: DispatchOfficer): boolean {
    return officer.status === 'active' || officer.status === 'disabled';
  }

  isToggling(officer: DispatchOfficer): boolean {
    return this.facade.togglingId() === officer.id;
  }

  toggleLabel(officer: DispatchOfficer): string {
    const rtl = this.locale.isRtl();
    if (officer.status === 'disabled') {
      return rtl ? 'تفعيل' : 'Enable';
    }
    return rtl ? 'تعطيل' : 'Disable';
  }

  toggle(event: Event, officer: DispatchOfficer): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.canToggle(officer) || this.isToggling(officer)) return;
    this.facade.toggleEnabled(officer.id);
  }

  goToPage(page: number): void {
    this.facade.goToPage(page);
  }

  nextPage(): void {
    this.facade.nextPage();
  }

  prevPage(): void {
    this.facade.prevPage();
  }
}
