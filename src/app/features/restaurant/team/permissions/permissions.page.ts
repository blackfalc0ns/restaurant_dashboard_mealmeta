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
  lucideKeyRound,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsBoardComponent,
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../../overview/overview-i18n';
import { TeamFacade } from '../data/team.facade';
import {
  ModuleKey,
  PermissionLevel,
  TeamRoleId,
} from '../models/team.model';
import { TeamSkeletonComponent } from '../team-skeleton.component';

@Component({
  selector: 'mm-permissions-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    TeamSkeletonComponent,
    RestaurantOpsHeroComponent,
    RestaurantOpsBoardComponent,
    RestaurantOpsToolbarComponent,
    RestaurantOpsFiltersComponent,
  ],
  templateUrl: './permissions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-team-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideInfo,
      lucideKeyRound,
      lucideUsers,
    }),
  ],
})
export class PermissionsPageComponent implements OnInit {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);

  readonly levels: { id: PermissionLevel; labelAr: string; labelEn: string }[] =
    [
      { id: 'none', labelAr: 'بدون', labelEn: 'None' },
      { id: 'view', labelAr: 'عرض', labelEn: 'View' },
      { id: 'manage', labelAr: 'إدارة', labelEn: 'Manage' },
    ];

  readonly title = computed(() => this.text('الصلاحيات', 'Permissions'));
  readonly subtitle = computed(() =>
    this.text(
      'مصفوفة الوحدات لكل دور في الداشبورد',
      'Module matrix for each dashboard role',
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

  readonly selectedRole = computed(() => this.facade.selectedRole());

  ngOnInit(): void {
    this.facade.load();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  roleName(roleId: TeamRoleId): string {
    const role = this.facade.data()?.roles.find((r) => r.id === roleId);
    return role ? pickLocale(role.name, this.locale.locale()) : roleId;
  }

  roleDetail(roleId: TeamRoleId): string {
    const role = this.facade.data()?.roles.find((r) => r.id === roleId);
    return role ? pickLocale(role.description, this.locale.locale()) : '';
  }

  moduleLabel(key: ModuleKey): string {
    const mod = this.facade.data()?.modules.find((m) => m.key === key);
    return mod ? pickLocale(mod.label, this.locale.locale()) : key;
  }

  moduleDetail(key: ModuleKey): string {
    const mod = this.facade.data()?.modules.find((m) => m.key === key);
    return mod ? pickLocale(mod.detail, this.locale.locale()) : '';
  }

  staffCount(roleId: TeamRoleId): number {
    return this.facade.staffCountByRole()[roleId] ?? 0;
  }

  setLevel(roleId: TeamRoleId, module: ModuleKey, level: PermissionLevel): void {
    this.facade.setRolePermission(roleId, module, level);
  }
}
