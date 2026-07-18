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
  lucideMail,
  lucidePhone,
  lucideSearch,
  lucideUserPlus,
  lucideUserRound,
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
import {
  RestaurantStaffMember,
  StaffFilter,
  TeamRoleId,
} from '../models/team.model';
import { TeamSkeletonComponent } from '../team-skeleton.component';
import { StaffInviteModalComponent } from './staff-invite-modal.component';

@Component({
  selector: 'mm-staff-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    TeamSkeletonComponent,
    StaffInviteModalComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
    RestaurantOpsPagerComponent,
  ],
  templateUrl: './staff.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-team-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideInfo,
      lucideMail,
      lucidePhone,
      lucideSearch,
      lucideUserPlus,
      lucideUserRound,
    }),
  ],
})
export class StaffPageComponent implements OnInit {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);

  readonly filters: { id: StaffFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'active', labelAr: 'نشط', labelEn: 'Active' },
    { id: 'invited', labelAr: 'مدعو', labelEn: 'Invited' },
    { id: 'disabled', labelAr: 'معطّل', labelEn: 'Disabled' },
  ];
  readonly title = computed(() => this.text('الموظفون', 'Staff'));
  readonly subtitle = computed(() =>
    this.text(
      'دعوة وتعيين الأدوار ونطاق الفروع',
      'Invite, assign roles, and branch scope',
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
    const total = this.facade.filteredStaff().length;
    if (total === 0) return this.text('لا نتائج', 'No results');
    const page = this.facade.staffPage();
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

  memberName(member: RestaurantStaffMember): string {
    return pickLocale(member.fullName, this.locale.locale());
  }

  roleName(roleId: TeamRoleId): string {
    const role = this.facade.data()?.roles.find((r) => r.id === roleId);
    return role ? pickLocale(role.name, this.locale.locale()) : roleId;
  }

  branchScope(member: RestaurantStaffMember): string {
    if (member.allBranches) return this.text('كل الفروع', 'All branches');
    const data = this.facade.data();
    if (!data || member.branchIds.length === 0) {
      return this.text('بدون فرع', 'No branch');
    }
    return member.branchIds
      .map((id) => {
        const branch = data.branches.find((b) => b.id === id);
        return branch ? pickLocale(branch.name, this.locale.locale()) : id;
      })
      .join(' · ');
  }

  statusLabel(member: RestaurantStaffMember): string {
    switch (member.status) {
      case 'active':
        return this.text('نشط', 'Active');
      case 'invited':
        return this.text('مدعو', 'Invited');
      case 'disabled':
        return this.text('معطّل', 'Disabled');
    }
  }

  onSearch(value: string): void {
    this.facade.setStaffSearch(value);
  }

  setFilter(filter: StaffFilter): void {
    this.facade.setStaffFilter(filter);
  }

  prevPage(): void {
    this.facade.setStaffPage(this.facade.staffPage() - 1);
  }

  nextPage(): void {
    this.facade.setStaffPage(this.facade.staffPage() + 1);
  }

  goToPage(page: number): void {
    this.facade.setStaffPage(page);
  }

  pickLocaleLabel(label: { ar: string; en: string }): string {
    return pickLocale(label, this.locale.locale());
  }
}
