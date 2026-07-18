import { Injectable, computed, signal } from '@angular/core';

import { PageStateModel } from '@/shared/models/page-view-state.model';

import {
  BranchDraft,
  BranchFilter,
  BranchStatus,
  ModuleKey,
  PermissionLevel,
  RestaurantBranch,
  RestaurantStaffMember,
  RestaurantTeamData,
  StaffFilter,
  StaffInviteDraft,
  StaffStatus,
  TeamRoleId,
} from '../models/team.model';
import { cloneTeamMock } from './team.mock';

export const TEAM_PAGE_SIZE = 8;

const emptyBranchDraft = (): BranchDraft => ({
  nameAr: '',
  nameEn: '',
  code: '',
  addressAr: '',
  addressEn: '',
  governorateAr: '',
  governorateEn: '',
  phone: '',
  status: 'active',
  notesAr: '',
  notesEn: '',
  managerMode: 'none',
  managerId: '',
  inviteNameAr: '',
  inviteNameEn: '',
  inviteEmail: '',
  invitePhone: '',
});

const emptyInviteDraft = (): StaffInviteDraft => ({
  fullNameAr: '',
  fullNameEn: '',
  email: '',
  phone: '',
  roleId: 'viewer',
  allBranches: false,
  branchIds: [],
});

@Injectable({ providedIn: 'root' })
export class TeamFacade {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly data = signal<RestaurantTeamData | null>(null);

  readonly branchFilter = signal<BranchFilter>('all');
  readonly branchSearch = signal('');
  readonly branchPage = signal(1);

  readonly staffFilter = signal<StaffFilter>('all');
  readonly staffSearch = signal('');
  readonly staffPage = signal(1);

  readonly selectedRoleId = signal<TeamRoleId>('owner');
  readonly branchDraft = signal<BranchDraft>(emptyBranchDraft());
  readonly inviteDraft = signal<StaffInviteDraft>(emptyInviteDraft());
  readonly inviteOpen = signal(false);
  readonly branchFormOpen = signal(false);
  readonly editingBranchId = signal<string | null>(null);
  readonly saving = signal(false);

  readonly pageSize = TEAM_PAGE_SIZE;

  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private actionTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredBranches = computed(() => {
    const data = this.data();
    if (!data) return [];
    const filter = this.branchFilter();
    const query = this.branchSearch().trim().toLowerCase();

    return data.branches.filter((branch) => {
      if (filter !== 'all' && branch.status !== filter) return false;
      if (!query) return true;
      const haystack = [
        branch.name.ar,
        branch.name.en,
        branch.code,
        branch.address.ar,
        branch.address.en,
        branch.governorate.ar,
        branch.governorate.en,
        branch.phone,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly branchFilterCounts = computed<Record<BranchFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, active: 0, paused: 0 };
    if (!data) return empty;
    return {
      all: data.branches.length,
      active: data.branches.filter((b) => b.status === 'active').length,
      paused: data.branches.filter((b) => b.status === 'paused').length,
    };
  });

  readonly branchTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredBranches().length / this.pageSize)),
  );

  readonly pagedBranches = computed(() => {
    const page = this.branchPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredBranches().slice(start, start + this.pageSize);
  });

  readonly branchPageNumbers = computed(() =>
    Array.from({ length: this.branchTotalPages() }, (_, i) => i + 1),
  );

  readonly filteredStaff = computed(() => {
    const data = this.data();
    if (!data) return [];
    const filter = this.staffFilter();
    const query = this.staffSearch().trim().toLowerCase();

    return data.staff.filter((member) => {
      if (filter !== 'all' && member.status !== filter) return false;
      if (!query) return true;
      const role = data.roles.find((r) => r.id === member.roleId);
      const haystack = [
        member.fullName.ar,
        member.fullName.en,
        member.email,
        member.phone,
        role?.name.ar ?? '',
        role?.name.en ?? '',
        member.roleId,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly staffFilterCounts = computed<Record<StaffFilter, number>>(() => {
    const data = this.data();
    const empty = { all: 0, active: 0, invited: 0, disabled: 0 };
    if (!data) return empty;
    return {
      all: data.staff.length,
      active: data.staff.filter((s) => s.status === 'active').length,
      invited: data.staff.filter((s) => s.status === 'invited').length,
      disabled: data.staff.filter((s) => s.status === 'disabled').length,
    };
  });

  readonly staffTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredStaff().length / this.pageSize)),
  );

  readonly pagedStaff = computed(() => {
    const page = this.staffPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredStaff().slice(start, start + this.pageSize);
  });

  readonly staffPageNumbers = computed(() =>
    Array.from({ length: this.staffTotalPages() }, (_, i) => i + 1),
  );

  readonly selectedRole = computed(() => {
    const data = this.data();
    const id = this.selectedRoleId();
    return data?.roles.find((role) => role.id === id) ?? null;
  });

  readonly staffCountByRole = computed(() => {
    const data = this.data();
    const counts: Partial<Record<TeamRoleId, number>> = {};
    if (!data) return counts;
    for (const member of data.staff) {
      counts[member.roleId] = (counts[member.roleId] ?? 0) + 1;
    }
    return counts;
  });

  /** Active staff eligible to manage a branch. */
  readonly managerCandidates = computed(() => {
    const data = this.data();
    if (!data) return [];
    return data.staff.filter(
      (member) =>
        member.status !== 'disabled' &&
        (member.roleId === 'branch_manager' ||
          member.roleId === 'owner' ||
          member.roleId === 'viewer' ||
          member.roleId === 'kitchen' ||
          member.roleId === 'finance'),
    );
  });

  load(): void {
    if (this.loadTimer) clearTimeout(this.loadTimer);
    this.page.set({ viewState: 'loading' });
    this.loadTimer = setTimeout(() => {
      const mock = cloneTeamMock();
      this.data.set(mock);
      this.selectedRoleId.set('owner');
      this.refreshSummaries(mock);
      this.page.set({ viewState: 'success' });
      this.loadTimer = null;
    }, 350);
  }

  retry(): void {
    this.load();
  }

  ensureLoaded(): void {
    if (this.data()) return;
    this.load();
  }

  setBranchFilter(filter: BranchFilter): void {
    this.branchFilter.set(filter);
    this.branchPage.set(1);
  }

  setBranchSearch(value: string): void {
    this.branchSearch.set(value);
    this.branchPage.set(1);
  }

  setBranchPage(page: number): void {
    this.branchPage.set(Math.min(Math.max(1, page), this.branchTotalPages()));
  }

  setStaffFilter(filter: StaffFilter): void {
    this.staffFilter.set(filter);
    this.staffPage.set(1);
  }

  setStaffSearch(value: string): void {
    this.staffSearch.set(value);
    this.staffPage.set(1);
  }

  setStaffPage(page: number): void {
    this.staffPage.set(Math.min(Math.max(1, page), this.staffTotalPages()));
  }

  selectRole(roleId: TeamRoleId): void {
    this.selectedRoleId.set(roleId);
  }

  openBranchForm(branch?: RestaurantBranch): void {
    if (branch) {
      this.editingBranchId.set(branch.id);
      this.branchDraft.set({
        nameAr: branch.name.ar,
        nameEn: branch.name.en,
        code: branch.code,
        addressAr: branch.address.ar,
        addressEn: branch.address.en,
        governorateAr: branch.governorate.ar,
        governorateEn: branch.governorate.en,
        phone: branch.phone,
        status: branch.status,
        notesAr: branch.notes?.ar ?? '',
        notesEn: branch.notes?.en ?? '',
        managerMode: branch.managerId ? 'existing' : 'none',
        managerId: branch.managerId ?? '',
        inviteNameAr: '',
        inviteNameEn: '',
        inviteEmail: '',
        invitePhone: '',
      });
    } else {
      this.editingBranchId.set(null);
      this.branchDraft.set(emptyBranchDraft());
    }
    this.branchFormOpen.set(true);
  }

  closeBranchForm(): void {
    this.branchFormOpen.set(false);
    this.editingBranchId.set(null);
    this.branchDraft.set(emptyBranchDraft());
  }

  patchBranchDraft(patch: Partial<BranchDraft>): void {
    this.branchDraft.update((draft) => ({ ...draft, ...patch }));
  }

  saveBranch(editingId?: string): void {
    const data = this.data();
    const draft = this.branchDraft();
    const targetId = editingId ?? this.editingBranchId() ?? undefined;
    if (!data || !draft.nameAr.trim() || !draft.code.trim()) return;
    if (draft.managerMode === 'existing' && !draft.managerId) return;
    if (
      draft.managerMode === 'invite' &&
      (!draft.inviteNameAr.trim() || !draft.inviteEmail.trim())
    ) {
      return;
    }

    this.saving.set(true);
    if (this.actionTimer) clearTimeout(this.actionTimer);
    this.actionTimer = setTimeout(() => {
      const next = structuredClone(data);
      let branchId = targetId ?? '';

      const branchPayload = {
        name: {
          ar: draft.nameAr.trim(),
          en: draft.nameEn.trim() || draft.nameAr.trim(),
        },
        code: draft.code.trim().toUpperCase(),
        address: {
          ar: draft.addressAr.trim(),
          en: draft.addressEn.trim() || draft.addressAr.trim(),
        },
        governorate: {
          ar: draft.governorateAr.trim(),
          en: draft.governorateEn.trim() || draft.governorateAr.trim(),
        },
        phone: draft.phone.trim(),
        status: draft.status,
        managerId: null as string | null,
        notes:
          draft.notesAr.trim() || draft.notesEn.trim()
            ? {
                ar: draft.notesAr.trim(),
                en: draft.notesEn.trim() || draft.notesAr.trim(),
              }
            : undefined,
      };

      if (targetId) {
        const idx = next.branches.findIndex((b) => b.id === targetId);
        if (idx >= 0) {
          next.branches[idx] = {
            ...next.branches[idx],
            ...branchPayload,
          };
          branchId = targetId;
        }
      } else {
        branchId = `BR-${String(next.branches.length + 1).padStart(3, '0')}`;
        next.branches.push({
          id: branchId,
          ...branchPayload,
          isPrimary: next.branches.length === 0,
          staffCount: 0,
        });
      }

      let managerId: string | null = null;
      if (draft.managerMode === 'existing') {
        managerId = draft.managerId || null;
      } else if (draft.managerMode === 'invite') {
        managerId = this.createInvitedManager(next, draft, branchId);
      }

      this.applyBranchManager(next, branchId, managerId);
      this.recomputeBranchStaffCounts(next);
      this.refreshSummaries(next);
      this.data.set(next);
      this.saving.set(false);
      this.closeBranchForm();
      this.actionTimer = null;
    }, 320);
  }

  private createInvitedManager(
    data: RestaurantTeamData,
    draft: BranchDraft,
    branchId: string,
  ): string {
    const member: RestaurantStaffMember = {
      id: `ST-${String(data.staff.length + 1).padStart(3, '0')}`,
      fullName: {
        ar: draft.inviteNameAr.trim(),
        en: draft.inviteNameEn.trim() || draft.inviteNameAr.trim(),
      },
      email: draft.inviteEmail.trim().toLowerCase(),
      phone: draft.invitePhone.trim(),
      roleId: 'branch_manager',
      allBranches: false,
      branchIds: [branchId],
      status: 'invited',
      lastActiveAtLabel: { ar: 'لم يسجّل بعد', en: 'Not signed in yet' },
      invitedAtLabel: {
        ar: 'دعوة مدير فرع · الآن',
        en: 'Branch manager invite · just now',
      },
    };
    data.staff.unshift(member);
    return member.id;
  }

  private applyBranchManager(
    data: RestaurantTeamData,
    branchId: string,
    managerId: string | null,
  ): void {
    const branch = data.branches.find((b) => b.id === branchId);
    if (!branch) return;

    // Clear this branch from previous managers who were only managing this one as managerId
    for (const other of data.branches) {
      if (other.id !== branchId && other.managerId === managerId && managerId) {
        // allow same person to manage multiple branches
      }
    }

    branch.managerId = managerId;

    if (!managerId) return;

    const member = data.staff.find((s) => s.id === managerId);
    if (!member) {
      branch.managerId = null;
      return;
    }

    if (member.roleId !== 'owner' && member.roleId !== 'branch_manager') {
      member.roleId = 'branch_manager';
    }

    if (!member.allBranches && !member.branchIds.includes(branchId)) {
      member.branchIds = [...member.branchIds, branchId];
    }

    if (member.status === 'disabled') {
      member.status = 'active';
    }
  }

  setBranchStatus(branchId: string, status: BranchStatus): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const branch = next.branches.find((b) => b.id === branchId);
    if (!branch || branch.isPrimary && status === 'paused') return;
    branch.status = status;
    this.refreshSummaries(next);
    this.data.set(next);
  }

  setPrimaryBranch(branchId: string): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    for (const branch of next.branches) {
      branch.isPrimary = branch.id === branchId;
      if (branch.isPrimary && branch.status === 'paused') {
        branch.status = 'active';
      }
    }
    this.data.set(next);
  }

  openInviteForm(): void {
    this.inviteDraft.set(emptyInviteDraft());
    this.inviteOpen.set(true);
  }

  closeInviteForm(): void {
    this.inviteOpen.set(false);
    this.inviteDraft.set(emptyInviteDraft());
  }

  patchInviteDraft(patch: Partial<StaffInviteDraft>): void {
    this.inviteDraft.update((draft) => ({ ...draft, ...patch }));
  }

  toggleInviteBranch(branchId: string): void {
    this.inviteDraft.update((draft) => {
      if (draft.allBranches) return draft;
      const has = draft.branchIds.includes(branchId);
      return {
        ...draft,
        branchIds: has
          ? draft.branchIds.filter((id) => id !== branchId)
          : [...draft.branchIds, branchId],
      };
    });
  }

  sendInvite(): void {
    const data = this.data();
    const draft = this.inviteDraft();
    if (!data || !draft.fullNameAr.trim() || !draft.email.trim()) return;

    this.saving.set(true);
    if (this.actionTimer) clearTimeout(this.actionTimer);
    this.actionTimer = setTimeout(() => {
      const next = structuredClone(data);
      const member: RestaurantStaffMember = {
        id: `ST-${String(next.staff.length + 1).padStart(3, '0')}`,
        fullName: {
          ar: draft.fullNameAr.trim(),
          en: draft.fullNameEn.trim() || draft.fullNameAr.trim(),
        },
        email: draft.email.trim().toLowerCase(),
        phone: draft.phone.trim(),
        roleId: draft.roleId,
        allBranches: draft.allBranches,
        branchIds: draft.allBranches ? [] : [...draft.branchIds],
        status: 'invited',
        lastActiveAtLabel: { ar: 'لم يسجّل بعد', en: 'Not signed in yet' },
        invitedAtLabel: { ar: 'الآن', en: 'Just now' },
      };
      next.staff.unshift(member);
      this.recomputeBranchStaffCounts(next);
      this.refreshSummaries(next);
      this.data.set(next);
      this.saving.set(false);
      this.closeInviteForm();
      this.actionTimer = null;
    }, 280);
  }

  setStaffStatus(staffId: string, status: StaffStatus): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const member = next.staff.find((s) => s.id === staffId);
    if (!member || member.roleId === 'owner') return;
    member.status = status;
    if (status === 'invited') {
      member.invitedAtLabel = { ar: 'أُعيدت الدعوة الآن', en: 'Invite resent now' };
      member.lastActiveAtLabel = { ar: 'لم يسجّل بعد', en: 'Not signed in yet' };
    }
    this.refreshSummaries(next);
    this.data.set(next);
  }

  updateStaffRole(staffId: string, roleId: TeamRoleId): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const member = next.staff.find((s) => s.id === staffId);
    if (!member || member.roleId === 'owner') return;
    member.roleId = roleId;
    this.data.set(next);
  }

  updateStaffBranches(
    staffId: string,
    allBranches: boolean,
    branchIds: string[],
  ): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const member = next.staff.find((s) => s.id === staffId);
    if (!member || member.roleId === 'owner') return;
    member.allBranches = allBranches;
    member.branchIds = allBranches ? [] : [...branchIds];
    this.recomputeBranchStaffCounts(next);
    this.data.set(next);
  }

  setRolePermission(
    roleId: TeamRoleId,
    module: ModuleKey,
    level: PermissionLevel,
  ): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const role = next.roles.find((r) => r.id === roleId);
    if (!role) return;
    if (roleId === 'owner') {
      role.permissions[module] = 'manage';
      this.data.set(next);
      return;
    }
    role.permissions[module] = level;
    this.data.set(next);
  }

  setStaffOverride(
    staffId: string,
    module: ModuleKey,
    level: PermissionLevel | null,
  ): void {
    const data = this.data();
    if (!data) return;
    const next = structuredClone(data);
    const member = next.staff.find((s) => s.id === staffId);
    if (!member || member.roleId === 'owner') return;
    if (!member.permissionOverrides) member.permissionOverrides = {};
    if (level === null) {
      delete member.permissionOverrides[module];
    } else {
      member.permissionOverrides[module] = level;
    }
    this.data.set(next);
  }

  branchById(branchId: string): RestaurantBranch | undefined {
    return this.data()?.branches.find((b) => b.id === branchId);
  }

  staffById(staffId: string): RestaurantStaffMember | undefined {
    return this.data()?.staff.find((s) => s.id === staffId);
  }

  effectivePermission(
    member: RestaurantStaffMember,
    module: ModuleKey,
  ): PermissionLevel {
    const override = member.permissionOverrides?.[module];
    if (override) return override;
    const role = this.data()?.roles.find((r) => r.id === member.roleId);
    return role?.permissions[module] ?? 'none';
  }

  private recomputeBranchStaffCounts(data: RestaurantTeamData): void {
    for (const branch of data.branches) {
      branch.staffCount = data.staff.filter(
        (s) =>
          s.status !== 'disabled' &&
          (s.allBranches || s.branchIds.includes(branch.id)),
      ).length;
    }
  }

  private refreshSummaries(data: RestaurantTeamData): void {
    data.summaries = [
      {
        id: 'branches',
        label: { ar: 'الفروع', en: 'Branches' },
        value: data.branches.length,
      },
      {
        id: 'staff',
        label: { ar: 'الموظفون', en: 'Staff' },
        value: data.staff.length,
      },
      {
        id: 'active',
        label: { ar: 'نشطون', en: 'Active' },
        value: data.staff.filter((s) => s.status === 'active').length,
      },
      {
        id: 'invited',
        label: { ar: 'دعوات', en: 'Invites' },
        value: data.staff.filter((s) => s.status === 'invited').length,
      },
    ];
  }
}
