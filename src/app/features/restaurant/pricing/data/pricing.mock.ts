import {
  PricingRow,
  RestaurantPricingData,
  RestaurantTier,
} from '../models/pricing.model';

export const PRICING_ACTIVE_DAYS = 26;
export const PRICING_BASIC_MAX_DAILY = 4.5;
export const PRICING_ELITE_MIN_DAILY = 6;

export function dailyFromMonthly(price26Kd: number): number {
  return price26Kd / PRICING_ACTIVE_DAYS;
}

export function classifyTierFromDaily(dailyKd: number): RestaurantTier {
  if (dailyKd < PRICING_BASIC_MAX_DAILY) return 'basic';
  if (dailyKd >= PRICING_ELITE_MIN_DAILY) return 'elite';
  return 'platinum';
}

export function netDailyBox(
  dailyKd: number,
  settlementCommissionPct: number,
): number {
  return dailyKd * (1 - settlementCommissionPct / 100);
}

export function roundMoney(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function tierContext(tier: RestaurantTier): { ar: string; en: string } {
  const map: Record<RestaurantTier, { ar: string; en: string }> = {
    basic: {
      ar: `يومي أقل من ${PRICING_BASIC_MAX_DAILY} د.ك`,
      en: `Daily below ${PRICING_BASIC_MAX_DAILY} KD`,
    },
    platinum: {
      ar: `يومي ${PRICING_BASIC_MAX_DAILY}–${PRICING_ELITE_MIN_DAILY} د.ك`,
      en: `Daily ${PRICING_BASIC_MAX_DAILY}–${PRICING_ELITE_MIN_DAILY} KD`,
    },
    elite: {
      ar: `يومي ${PRICING_ELITE_MIN_DAILY}+ د.ك`,
      en: `Daily ${PRICING_ELITE_MIN_DAILY}+ KD`,
    },
  };
  return map[tier];
}

/** Primary input is monthly (26-day) box price; daily is derived. */
export function derivePricingFields(
  price26DaysKd: number | null,
  settlementCommissionPct: number,
): Pick<
  PricingRow,
  | 'status'
  | 'dailyBoxPriceKd'
  | 'price26DaysKd'
  | 'tier'
  | 'tierContextLabel'
  | 'netDailyBoxKd'
> {
  if (
    price26DaysKd === null ||
    !Number.isFinite(price26DaysKd) ||
    price26DaysKd <= 0
  ) {
    return {
      status: 'missing',
      dailyBoxPriceKd: null,
      price26DaysKd: null,
      tier: null,
      tierContextLabel: {
        ar: 'أدخل سعر البوكس الشهري لإظهار التصنيف',
        en: 'Enter the monthly box price to show tier',
      },
      netDailyBoxKd: null,
    };
  }

  const monthly = roundMoney(price26DaysKd, 2);
  const daily = roundMoney(dailyFromMonthly(monthly));
  const tier = classifyTierFromDaily(daily);

  return {
    status: 'configured',
    price26DaysKd: monthly,
    dailyBoxPriceKd: daily,
    tier,
    tierContextLabel: tierContext(tier),
    netDailyBoxKd: roundMoney(netDailyBox(daily, settlementCommissionPct)),
  };
}

function row(
  partial: Omit<
    PricingRow,
    | 'status'
    | 'dailyBoxPriceKd'
    | 'tier'
    | 'tierContextLabel'
    | 'netDailyBoxKd'
  >,
): PricingRow {
  return {
    ...partial,
    ...derivePricingFields(
      partial.price26DaysKd,
      partial.settlementCommissionPct,
    ),
  };
}

const COMMISSION = 18;

export const PRICING_MOCK: RestaurantPricingData = {
  title: { ar: 'التسعير', en: 'Pricing' },
  subtitle: {
    ar: 'راجع أسعار البوكسات وحدّثها بسهولة من مكان واحد',
    en: 'Review and update box prices easily in one place',
  },
  dateLabel: {
    ar: 'السبت 11 يوليو 2026',
    en: 'Saturday, 11 Jul 2026',
  },
  note: {
    ar: 'الأسعار الجديدة تُطبق على الاشتراكات الجديدة فقط.',
    en: 'New prices apply to new subscriptions only.',
  },
  menuLinkLabel: { ar: 'القوائم والوجبات', en: 'Menus & meals' },
  menuRoute: '/restaurant/operations/menu',
  settlementCommissionPct: COMMISSION,
  summaries: [
    {
      id: 'total',
      label: { ar: 'البوكسات', en: 'Boxes' },
      value: 10,
      hint: { ar: 'تركيبات للتسعير', en: 'Combinations to price' },
      tone: 'neutral',
      icon: 'lucideLayers',
    },
    {
      id: 'configured',
      label: { ar: 'مسعّرة', en: 'Priced' },
      value: 7,
      hint: { ar: 'ظاهرة للعملاء', en: 'Visible to customers' },
      tone: 'primary',
      icon: 'lucideCheck',
    },
    {
      id: 'missing',
      label: { ar: 'بدون سعر', en: 'Unpriced' },
      value: 3,
      hint: { ar: 'مخفية حتى التسعير الشهري', en: 'Hidden until monthly price is set' },
      tone: 'warning',
      icon: 'lucideTriangleAlert',
    },
    {
      id: 'commission',
      label: { ar: 'عمولة التسوية', en: 'Settlement commission' },
      value: `${COMMISSION}%`,
      hint: { ar: 'من سعر البوكس اليومي', en: 'From daily box price' },
      tone: 'accent',
      icon: 'lucidePercent',
    },
  ],
  rows: [
    row({
      id: 'PRG-001:BND-001',
      programId: 'PRG-001',
      programLabel: { ar: 'رشاقة', en: 'Cutting' },
      bundleId: 'BND-001',
      bundleLabel: { ar: 'باقة كاملة', en: 'Full bundle' },
      price26DaysKd: 117,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث أمس', en: 'Updated yesterday' },
    }),
    row({
      id: 'PRG-001:BND-002',
      programId: 'PRG-001',
      programLabel: { ar: 'رشاقة', en: 'Cutting' },
      bundleId: 'BND-002',
      bundleLabel: { ar: 'باقة الغداء', en: 'Lunch bundle' },
      price26DaysKd: 91,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ 3 أيام', en: 'Updated 3d ago' },
    }),
    row({
      id: 'PRG-001:BND-003',
      programId: 'PRG-001',
      programLabel: { ar: 'رشاقة', en: 'Cutting' },
      bundleId: 'BND-003',
      bundleLabel: { ar: 'باقة مخصصة', en: 'Custom bundle' },
      price26DaysKd: null,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: '—', en: '—' },
    }),
    row({
      id: 'PRG-002:BND-001',
      programId: 'PRG-002',
      programLabel: { ar: 'ضخامة', en: 'Bulking' },
      bundleId: 'BND-001',
      bundleLabel: { ar: 'باقة كاملة', en: 'Full bundle' },
      price26DaysKd: 143,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ يومين', en: 'Updated 2d ago' },
    }),
    row({
      id: 'PRG-002:BND-002',
      programId: 'PRG-002',
      programLabel: { ar: 'ضخامة', en: 'Bulking' },
      bundleId: 'BND-002',
      bundleLabel: { ar: 'باقة الغداء', en: 'Lunch bundle' },
      price26DaysKd: 110,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ أسبوع', en: 'Updated 1w ago' },
    }),
    row({
      id: 'PRG-002:BND-003',
      programId: 'PRG-002',
      programLabel: { ar: 'ضخامة', en: 'Bulking' },
      bundleId: 'BND-003',
      bundleLabel: { ar: 'باقة مخصصة', en: 'Custom bundle' },
      price26DaysKd: null,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: '—', en: '—' },
    }),
    row({
      id: 'PRG-003:BND-001',
      programId: 'PRG-003',
      programLabel: { ar: 'محافظة', en: 'Maintain' },
      bundleId: 'BND-001',
      bundleLabel: { ar: 'باقة كاملة', en: 'Full bundle' },
      price26DaysKd: 125,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ 4 أيام', en: 'Updated 4d ago' },
    }),
    row({
      id: 'PRG-003:BND-002',
      programId: 'PRG-003',
      programLabel: { ar: 'محافظة', en: 'Maintain' },
      bundleId: 'BND-002',
      bundleLabel: { ar: 'باقة الغداء', en: 'Lunch bundle' },
      price26DaysKd: 96,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ 5 أيام', en: 'Updated 5d ago' },
    }),
    row({
      id: 'PRG-004:BND-001',
      programId: 'PRG-004',
      programLabel: { ar: 'كيتو', en: 'Keto' },
      bundleId: 'BND-001',
      bundleLabel: { ar: 'باقة كاملة', en: 'Full bundle' },
      price26DaysKd: 156,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: 'حدّث منذ يومين', en: 'Updated 2d ago' },
    }),
    row({
      id: 'PRG-004:BND-002',
      programId: 'PRG-004',
      programLabel: { ar: 'كيتو', en: 'Keto' },
      bundleId: 'BND-002',
      bundleLabel: { ar: 'باقة الغداء', en: 'Lunch bundle' },
      price26DaysKd: null,
      settlementCommissionPct: COMMISSION,
      updatedAtLabel: { ar: '—', en: '—' },
    }),
  ],
};
