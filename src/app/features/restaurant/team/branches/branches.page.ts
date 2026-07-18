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
  lucideInfo,
  lucideMapPinned,
  lucidePause,
  lucidePhone,
  lucidePlay,
  lucidePlus,
  lucideSearch,
  lucideStore,
  lucideUsers,
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

import { pickLocale } from '../../overview/overview-i18n';
import { TeamFacade } from '../data/team.facade';
import { BranchFilter, RestaurantBranch } from '../models/team.model';
import { TeamSkeletonComponent } from '../team-skeleton.component';
import { BranchFormModalComponent } from './branch-form-modal.component';

@Component({
  selector: 'mm-branches-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    TeamSkeletonComponent,
    BranchFormModalComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './branches.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-team-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideInfo,
      lucideMapPinned,
      lucidePause,
      lucidePhone,
      lucidePlay,
      lucidePlus,
      lucideSearch,
      lucideStore,
      lucideUsers,
    }),
  ],
})
export class BranchesPageComponent implements OnInit {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: { id: BranchFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'نشط', labelEn: 'Active' },
    { id: 'paused', labelAr: 'متوقف', labelEn: 'Paused' },
  ];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data
      ? this.text('الفروع', 'Branches')
      : '';
  });

  readonly subtitle = computed(() =>
    this.text(
      'مواقع التشغيل لنفس حساب المطعم',
      'Operating locations for the same restaurant account',
    ),
  );

  readonly dateLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.dateLabel, this.locale.locale()) : '';
  });

  readonly note = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.note, this.locale.locale()) : '';
  });

  readonly rangeText = computed(() => {
    const total = this.facade.filteredBranches().length;
    if (total === 0) return this.text('لا نتائج', 'No results');
    const page = this.facade.branchPage();
    const size = this.facade.pageSize;
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return this.text(`${start}–${end} من ${total}`, `${start}–${end} of ${total}`);
  });

  ngOnInit(): void {
    this.facade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  filterLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  branchName(branch: RestaurantBranch): string {
    return pickLocale(branch.name, this.locale.locale());
  }

  branchAddress(branch: RestaurantBranch): string {
    return pickLocale(branch.address, this.locale.locale());
  }

  branchGovernorate(branch: RestaurantBranch): string {
    return pickLocale(branch.governorate, this.locale.locale());
  }

  statusLabel(branch: RestaurantBranch): string {
    if (branch.status === 'active') return this.text('نشط', 'Active');
    return this.text('متوقف', 'Paused');
  }

  managerName(branch: RestaurantBranch): string {
    if (!branch.managerId) return this.text('غير معيّن', 'Unassigned');
    const member = this.facade.staffById(branch.managerId);
    return member
      ? pickLocale(member.fullName, this.locale.locale())
      : this.text('غير معيّن', 'Unassigned');
  }

  onSearch(value: string): void {
    this.facade.setBranchSearch(value);
  }

  setFilter(filter: BranchFilter): void {
    this.facade.setBranchFilter(filter);
  }

  openCreate(): void {
    this.facade.openBranchForm();
  }

  toggleStatus(branch: RestaurantBranch, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (branch.isPrimary) return;
    this.facade.setBranchStatus(
      branch.id,
      branch.status === 'active' ? 'paused' : 'active',
    );
  }

  prevPage(): void {
    this.facade.setBranchPage(this.facade.branchPage() - 1);
  }

  nextPage(): void {
    this.facade.setBranchPage(this.facade.branchPage() + 1);
  }

  goToPage(page: number): void {
    this.facade.setBranchPage(page);
  }
}
