import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideInfo,
  lucideMapPinned,
  lucidePhone,
  lucideSave,
  lucideStar,
  lucideStore,
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
import { RestaurantBranch } from '../models/team.model';
import { TeamSkeletonComponent } from '../team-skeleton.component';

@Component({
  selector: 'mm-branch-detail-page',
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
  templateUrl: './branch-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-team-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideInfo,
      lucideMapPinned,
      lucidePhone,
      lucideSave,
      lucideStar,
      lucideStore,
    }),
  ],
})
export class BranchDetailPageComponent implements OnInit {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);

  private readonly branchId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('branchId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('branchId') ?? '' },
  );

  readonly branch = computed(() => {
    const id = this.branchId();
    return id ? this.facade.branchById(id) : undefined;
  });

  readonly staffOnBranch = computed(() => {
    const data = this.facade.data();
    const branch = this.branch();
    if (!data || !branch) return [];
    return data.staff.filter(
      (s) => s.allBranches || s.branchIds.includes(branch.id),
    );
  });

  ngOnInit(): void {
    this.facade.ensureLoaded();
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  name(branch: RestaurantBranch): string {
    return pickLocale(branch.name, this.locale.locale());
  }

  address(branch: RestaurantBranch): string {
    return pickLocale(branch.address, this.locale.locale());
  }

  governorate(branch: RestaurantBranch): string {
    return pickLocale(branch.governorate, this.locale.locale());
  }

  notes(branch: RestaurantBranch): string {
    return branch.notes ? pickLocale(branch.notes, this.locale.locale()) : '';
  }

  startEdit(branch: RestaurantBranch): void {
    this.facade.openBranchForm(branch);
  }

  save(branch: RestaurantBranch): void {
    this.facade.saveBranch(branch.id);
  }

  setPrimary(branch: RestaurantBranch): void {
    this.facade.setPrimaryBranch(branch.id);
  }

  setStatus(branch: RestaurantBranch, status: 'active' | 'paused'): void {
    this.facade.setBranchStatus(branch.id, status);
  }

  pickName(member: { fullName: { ar: string; en: string } }): string {
    return pickLocale(member.fullName, this.locale.locale());
  }

  staffStatus(status: string): string {
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
}
