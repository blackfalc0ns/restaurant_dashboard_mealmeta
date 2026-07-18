import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type BranchStatus = 'active' | 'paused';
export type BranchFilter = 'all' | BranchStatus;

export type StaffStatus = 'active' | 'invited' | 'disabled';
export type StaffFilter = 'all' | StaffStatus;

export type PermissionLevel = 'none' | 'view' | 'manage';

export type ModuleKey =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'operations'
  | 'delivery'
  | 'finance'
  | 'quality'
  | 'team'
  | 'settings';

export type TeamRoleId =
  | 'owner'
  | 'branch_manager'
  | 'kitchen'
  | 'finance'
  | 'viewer';

export interface TeamSummary {
  id: string;
  label: LocalizedText;
  value: number;
}

export interface RestaurantBranch {
  id: string;
  name: LocalizedText;
  code: string;
  address: LocalizedText;
  governorate: LocalizedText;
  phone: string;
  status: BranchStatus;
  isPrimary: boolean;
  staffCount: number;
  notes?: LocalizedText;
}

export interface TeamRole {
  id: TeamRoleId;
  name: LocalizedText;
  description: LocalizedText;
  isSystem: boolean;
  permissions: Record<ModuleKey, PermissionLevel>;
}

export interface RestaurantStaffMember {
  id: string;
  fullName: LocalizedText;
  email: string;
  phone: string;
  roleId: TeamRoleId;
  /** When true, staff can access every branch. */
  allBranches: boolean;
  branchIds: string[];
  status: StaffStatus;
  lastActiveAtLabel: LocalizedText;
  invitedAtLabel?: LocalizedText;
  permissionOverrides?: Partial<Record<ModuleKey, PermissionLevel>>;
}

export interface TeamModuleMeta {
  key: ModuleKey;
  label: LocalizedText;
  detail: LocalizedText;
}

export interface RestaurantTeamData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  summaries: TeamSummary[];
  branches: RestaurantBranch[];
  staff: RestaurantStaffMember[];
  roles: TeamRole[];
  modules: TeamModuleMeta[];
}

export interface BranchDraft {
  nameAr: string;
  nameEn: string;
  code: string;
  addressAr: string;
  addressEn: string;
  governorateAr: string;
  governorateEn: string;
  phone: string;
  status: BranchStatus;
  notesAr: string;
  notesEn: string;
}

export interface StaffInviteDraft {
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  phone: string;
  roleId: TeamRoleId;
  allBranches: boolean;
  branchIds: string[];
}
