import {
  ModuleKey,
  PermissionLevel,
  RestaurantTeamData,
  TeamRole,
  TeamRoleId,
} from '../models/team.model';

const manageAll = (): Record<ModuleKey, PermissionLevel> => ({
  overview: 'manage',
  orders: 'manage',
  menu: 'manage',
  operations: 'manage',
  delivery: 'manage',
  finance: 'manage',
  quality: 'manage',
  team: 'manage',
  settings: 'manage',
});

const viewMost = (): Record<ModuleKey, PermissionLevel> => ({
  overview: 'view',
  orders: 'view',
  menu: 'view',
  operations: 'view',
  delivery: 'view',
  finance: 'view',
  quality: 'view',
  team: 'none',
  settings: 'none',
});

const ROLES: TeamRole[] = [
  {
    id: 'owner',
    name: { ar: 'مالك', en: 'Owner' },
    description: {
      ar: 'صلاحيات كاملة على المطعم والفروع والموظفين',
      en: 'Full access to restaurant, branches, and staff',
    },
    isSystem: true,
    permissions: manageAll(),
  },
  {
    id: 'branch_manager',
    name: { ar: 'مدير فرع', en: 'Branch manager' },
    description: {
      ar: 'تشغيل وطلبات وقائمة للفروع المعيّنة',
      en: 'Ops, orders, and menu for assigned branches',
    },
    isSystem: true,
    permissions: {
      overview: 'manage',
      orders: 'manage',
      menu: 'manage',
      operations: 'manage',
      delivery: 'view',
      finance: 'view',
      quality: 'view',
      team: 'view',
      settings: 'none',
    },
  },
  {
    id: 'kitchen',
    name: { ar: 'مطبخ', en: 'Kitchen' },
    description: {
      ar: 'طلبات وملصقات وسعة يومية',
      en: 'Orders, labels, and daily capacity',
    },
    isSystem: true,
    permissions: {
      overview: 'view',
      orders: 'manage',
      menu: 'view',
      operations: 'manage',
      delivery: 'none',
      finance: 'none',
      quality: 'view',
      team: 'none',
      settings: 'none',
    },
  },
  {
    id: 'finance',
    name: { ar: 'مالية', en: 'Finance' },
    description: {
      ar: 'مستحقات وفواتير وتقارير',
      en: 'Dues, invoices, and reports',
    },
    isSystem: true,
    permissions: {
      overview: 'view',
      orders: 'view',
      menu: 'none',
      operations: 'none',
      delivery: 'none',
      finance: 'manage',
      quality: 'none',
      team: 'none',
      settings: 'view',
    },
  },
  {
    id: 'viewer',
    name: { ar: 'مشاهد', en: 'Viewer' },
    description: {
      ar: 'عرض فقط لمعظم إدارات الداشبورد',
      en: 'Read-only access to most dashboard departments',
    },
    isSystem: true,
    permissions: viewMost(),
  },
];

export const TEAM_MOCK: RestaurantTeamData = {
  title: { ar: 'الفريق والفروع', en: 'Team & branches' },
  subtitle: {
    ar: 'إدارة مواقع التشغيل والموظفين وصلاحيات الوصول',
    en: 'Manage operating locations, staff, and access permissions',
  },
  dateLabel: { ar: 'تحديث تجريبي · يوليو 2026', en: 'Demo update · Jul 2026' },
  note: {
    ar: 'البيانات تجريبية. مصفوفة الإدارات تُحفظ محلياً حتى ربط الهوية من الخادم.',
    en: 'Demo data. The departments matrix is local until identity wiring from the API.',
  },
  summaries: [
    {
      id: 'branches',
      label: { ar: 'الفروع', en: 'Branches' },
      value: 3,
    },
    {
      id: 'staff',
      label: { ar: 'الموظفون', en: 'Staff' },
      value: 6,
    },
    {
      id: 'active',
      label: { ar: 'نشطون', en: 'Active' },
      value: 4,
    },
    {
      id: 'invited',
      label: { ar: 'دعوات', en: 'Invites' },
      value: 1,
    },
  ],
  modules: [
    {
      key: 'overview',
      label: { ar: 'إدارة الرئيسية', en: 'Overview dept' },
      detail: { ar: 'نظرة عامة وتحليلات', en: 'Overview and analytics' },
    },
    {
      key: 'orders',
      label: { ar: 'إدارة الطلبات', en: 'Orders dept' },
      detail: { ar: 'اليوم والتأكيد والملصقات', en: 'Daily, confirmation, labels' },
    },
    {
      key: 'menu',
      label: { ar: 'إدارة القوائم', en: 'Menus dept' },
      detail: { ar: 'الوجبات والتسعير', en: 'Meals and pricing' },
    },
    {
      key: 'operations',
      label: { ar: 'إدارة التشغيل', en: 'Operations dept' },
      detail: { ar: 'المناطق والسعة', en: 'Regions and capacity' },
    },
    {
      key: 'delivery',
      label: { ar: 'إدارة التوصيل', en: 'Delivery dept' },
      detail: { ar: 'السائقون والرحلات', en: 'Drivers and trips' },
    },
    {
      key: 'finance',
      label: { ar: 'إدارة المالية', en: 'Finance dept' },
      detail: { ar: 'مستحقات وفواتير', en: 'Dues and invoices' },
    },
    {
      key: 'quality',
      label: { ar: 'إدارة الجودة', en: 'Quality dept' },
      detail: { ar: 'التقييمات والشكاوى', en: 'Ratings and complaints' },
    },
    {
      key: 'team',
      label: { ar: 'إدارة الفريق', en: 'Team dept' },
      detail: { ar: 'فروع وموظفون وصلاحيات', en: 'Branches, staff, permissions' },
    },
    {
      key: 'settings',
      label: { ar: 'إدارة الإعدادات', en: 'Settings dept' },
      detail: { ar: 'ملف المطعم والأمان', en: 'Restaurant profile and security' },
    },
  ],
  roles: ROLES,
  branches: [
    {
      id: 'BR-001',
      name: { ar: 'الفرع الرئيسي — السالمية', en: 'Main branch — Salmiya' },
      code: 'SAL-01',
      address: {
        ar: 'شارع سالم المبارك، مجمع 12، السالمية',
        en: 'Salem Al Mubarak St, Block 12, Salmiya',
      },
      governorate: { ar: 'حولي', en: 'Hawalli' },
      phone: '+965 2222 1101',
      status: 'active',
      isPrimary: true,
      staffCount: 4,
      managerId: 'ST-002',
      notes: {
        ar: 'مطبخ مركزي وتجهيز ملصقات اليوم',
        en: 'Central kitchen and daily label prep',
      },
    },
    {
      id: 'BR-002',
      name: { ar: 'فرع الجهراء', en: 'Jahra branch' },
      code: 'JAH-01',
      address: {
        ar: 'الطريق الدائري الخامس، الجهراء',
        en: '5th Ring Road, Jahra',
      },
      governorate: { ar: 'الجهراء', en: 'Jahra' },
      phone: '+965 2222 1102',
      status: 'active',
      isPrimary: false,
      staffCount: 2,
      managerId: 'ST-002',
    },
    {
      id: 'BR-003',
      name: { ar: 'فرع الفحيحيل', en: 'Fahaheel branch' },
      code: 'FAH-01',
      address: {
        ar: 'شارع الدبوس، الفحيحيل',
        en: 'Al Dabous St, Fahaheel',
      },
      governorate: { ar: 'الأحمدي', en: 'Ahmadi' },
      phone: '+965 2222 1103',
      status: 'paused',
      isPrimary: false,
      staffCount: 1,
      managerId: 'ST-006',
      notes: {
        ar: 'متوقف مؤقتاً لصيانة المطبخ',
        en: 'Temporarily paused for kitchen maintenance',
      },
    },
  ],
  staff: [
    {
      id: 'ST-001',
      fullName: { ar: 'نورة العتيبي', en: 'Noura Al Otaibi' },
      email: 'noura.owner@mealmate.demo',
      phone: '+965 5000 1001',
      roleId: 'owner',
      allBranches: true,
      branchIds: [],
      status: 'active',
      lastActiveAtLabel: { ar: 'اليوم · 09:40', en: 'Today · 09:40' },
    },
    {
      id: 'ST-002',
      fullName: { ar: 'خالد المنصوري', en: 'Khaled Al Mansouri' },
      email: 'khaled.mgr@mealmate.demo',
      phone: '+965 5000 1002',
      roleId: 'branch_manager',
      allBranches: false,
      branchIds: ['BR-001', 'BR-002'],
      status: 'active',
      lastActiveAtLabel: { ar: 'أمس · 18:12', en: 'Yesterday · 18:12' },
    },
    {
      id: 'ST-003',
      fullName: { ar: 'مريم الشمري', en: 'Maryam Al Shammari' },
      email: 'maryam.kitchen@mealmate.demo',
      phone: '+965 5000 1003',
      roleId: 'kitchen',
      allBranches: false,
      branchIds: ['BR-001'],
      status: 'active',
      lastActiveAtLabel: { ar: 'اليوم · 07:05', en: 'Today · 07:05' },
    },
    {
      id: 'ST-004',
      fullName: { ar: 'سارة الحربي', en: 'Sara Al Harbi' },
      email: 'sara.finance@mealmate.demo',
      phone: '+965 5000 1004',
      roleId: 'finance',
      allBranches: true,
      branchIds: [],
      status: 'active',
      lastActiveAtLabel: { ar: 'منذ ساعتين', en: '2 hours ago' },
    },
    {
      id: 'ST-005',
      fullName: { ar: 'يوسف العازمي', en: 'Yousef Al Azmi' },
      email: 'yousef.viewer@mealmate.demo',
      phone: '+965 5000 1005',
      roleId: 'viewer',
      allBranches: false,
      branchIds: ['BR-002'],
      status: 'invited',
      lastActiveAtLabel: { ar: 'لم يسجّل بعد', en: 'Not signed in yet' },
      invitedAtLabel: { ar: 'قبل يومين', en: '2 days ago' },
    },
    {
      id: 'ST-006',
      fullName: { ar: 'فاطمة الصباح', en: 'Fatima Al Sabah' },
      email: 'fatima.kitchen@mealmate.demo',
      phone: '+965 5000 1006',
      roleId: 'kitchen',
      allBranches: false,
      branchIds: ['BR-003'],
      status: 'disabled',
      lastActiveAtLabel: { ar: 'قبل أسبوع', en: '1 week ago' },
      permissionOverrides: {
        orders: 'view',
      },
    },
  ],
};

export function cloneTeamMock(): RestaurantTeamData {
  return structuredClone(TEAM_MOCK);
}

export function roleById(
  roles: TeamRole[],
  id: TeamRoleId,
): TeamRole | undefined {
  return roles.find((role) => role.id === id);
}
