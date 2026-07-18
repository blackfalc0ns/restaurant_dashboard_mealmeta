import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideInfo,
  lucideKeyRound,
  lucideMail,
  lucidePhone,
  lucideUserRound,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsDetailHeroComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../../overview/overview-i18n';
import { TeamFacade } from '../data/team.facade';
import {
  ModuleKey,
  PermissionLevel,
  RestaurantStaffMember,
  TeamRoleId,
} from '../models/team.model';
import { TeamSkeletonComponent } from '../team-skeleton.component';

@Component({
  selector: 'mm-staff-detail-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    TeamSkeletonComponent,
    RestaurantOpsDetailHeroComponent,
    RestaurantOpsBoardComponent,
  ],
  templateUrl: './staff-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-team-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideInfo,
      lucideKeyRound,
      lucideMail,
      lucidePhone,
      lucideUserRound,
    }),
  ],
})
export class StaffDetailPageComponent implements OnInit {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly staffId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('staffId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('staffId') ?? '' },
  );

  readonly draftAllBranches = signal(false);
  readonly draftBranchIds = signal<string[]>([]);

  readonly member = computed(() => {
    const id = this.staffId();
    return id ? this.facade.staffById(id) : undefined;
  });

  readonly isOwner = computed(() => this.member()?.roleId === 'owner');

  readonly roleOptions: { id: TeamRoleId; labelAr: string; labelEn: string }[] =
    [
      { id: 'branch_manager', labelAr: 'مدير فرع', labelEn: 'Branch manager' },
      { id: 'kitchen', labelAr: 'مطبخ', labelEn: 'Kitchen' },
      { id: 'finance', labelAr: 'مالية', labelEn: 'Finance' },
      { id: 'viewer', labelAr: 'مشاهد', labelEn: 'Viewer' },
    ];

  readonly levels: { id: PermissionLevel; labelAr: string; labelEn: string }[] =
    [
      { id: 'none', labelAr: 'بدون', labelEn: 'None' },
      { id: 'view', labelAr: 'عرض', labelEn: 'View' },
      { id: 'manage', labelAr: 'إدارة', labelEn: 'Manage' },
    ];

  ngOnInit(): void {
    this.facade.ensureLoaded();
  }

  constructor() {
    effect(() => {
      const member = this.member();
      if (!member) return;
      this.draftAllBranches.set(member.allBranches);
      this.draftBranchIds.set([...member.branchIds]);
    });
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  name(member: RestaurantStaffMember): string {
    return pickLocale(member.fullName, this.locale.locale());
  }

  roleName(roleId: TeamRoleId): string {
    const role = this.facade.data()?.roles.find((r) => r.id === roleId);
    return role ? pickLocale(role.name, this.locale.locale()) : roleId;
  }

  moduleLabel(key: ModuleKey): string {
    const mod = this.facade.data()?.modules.find((m) => m.key === key);
    return mod ? pickLocale(mod.label, this.locale.locale()) : key;
  }

  levelLabel(level: PermissionLevel): string {
    const found = this.levels.find((l) => l.id === level);
    return found
      ? this.locale.isRtl()
        ? found.labelAr
        : found.labelEn
      : level;
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'active':
        return this.text('نشط', 'Active');
      case 'invited':
        return this.text('مدعو', 'Invited');
      case 'disabled':
        return this.text('معطّل', 'Disabled');
      default:
        return status;
    }
  }

  toggleBranch(branchId: string): void {
    if (this.draftAllBranches()) return;
    this.draftBranchIds.update((ids) =>
      ids.includes(branchId)
        ? ids.filter((id) => id !== branchId)
        : [...ids, branchId],
    );
  }

  saveBranches(member: RestaurantStaffMember): void {
    this.facade.updateStaffBranches(
      member.id,
      this.draftAllBranches(),
      this.draftBranchIds(),
    );
  }

  setRole(member: RestaurantStaffMember, roleId: TeamRoleId): void {
    this.facade.updateStaffRole(member.id, roleId);
  }

  effective(member: RestaurantStaffMember, module: ModuleKey): PermissionLevel {
    return this.facade.effectivePermission(member, module);
  }
}
