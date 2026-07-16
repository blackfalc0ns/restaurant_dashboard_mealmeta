import {
  DueLine,
  DueTimelineEvent,
  RestaurantDuesData,
} from '../models/dues.model';

function timeline(
  events: Array<
    Pick<DueTimelineEvent, 'id' | 'title' | 'timeLabel' | 'tone'>
  >,
): DueTimelineEvent[] {
  return events;
}

function line(partial: DueLine): DueLine {
  return partial;
}

export const DUES_MOCK: RestaurantDuesData = {
  title: { ar: 'المستحقات والعمولات', en: 'Dues & commissions' },
  subtitle: {
    ar: 'مستحق الوجبات المسلّمة وعمولة المطعم المتفق عليها مع MealMate.',
    en: 'Payables for delivered boxes and the agreed restaurant commission with MealMate.',
  },
  dateLabel: { ar: 'يوليو 2026', en: 'July 2026' },
  note: {
    ar: 'المبالغ للمطعم فقط. عمولة اشتراك العميل لا تظهر هنا. عمولة المطعم تُخصم من سعر الصندوق المتفق عليه.',
    en: 'Restaurant-facing amounts only. Customer subscription commission is not shown. Restaurant commission is deducted from the agreed box price.',
  },
  commissionNote: {
    ar: 'نسبة عمولة المطعم حسب الاتفاق الحالي: 15%.',
    en: 'Current restaurant commission rate per agreement: 15%.',
  },
  agreementRatePct: 15,
  summaries: [
    {
      id: 'pending',
      label: { ar: 'مستحق معلّق', en: 'Pending payout' },
      valueKd: 482.5,
      hint: { ar: 'جاهز للتحويل', en: 'Ready for transfer' },
    },
    {
      id: 'gross',
      label: { ar: 'مستحق الوجبات', en: 'Meal payables' },
      valueKd: 1260.75,
      hint: { ar: 'هذا الشهر', en: 'This month' },
    },
    {
      id: 'commission',
      label: { ar: 'عمولة المطعم', en: 'Restaurant commission' },
      valueKd: 189.1,
      hint: { ar: '15% من المستحق', en: '15% of payables' },
    },
    {
      id: 'net',
      label: { ar: 'صافي بعد العمولة', en: 'Net after commission' },
      valueKd: 1071.65,
      hint: { ar: 'قبل خصومات الشكاوى', en: 'Before complaint deductions' },
    },
  ],
  lines: [
    line({
      id: 'due-01',
      code: 'DUE-0726-W3',
      kind: 'meal_payable',
      status: 'pending',
      title: { ar: 'مستحق أسبوع 13–15 يوليو', en: 'Payable week 13–15 Jul' },
      detail: {
        ar: '84 صندوق مسلّم · عمولة 15%',
        en: '84 boxes delivered · 15% commission',
      },
      periodLabel: { ar: '13–15 يوليو', en: '13–15 Jul' },
      boxesDelivered: 84,
      grossKd: 318.0,
      commissionKd: 47.7,
      commissionRatePct: 15,
      netKd: 270.3,
      updatedAtLabel: { ar: 'اليوم 09:40', en: 'Today 09:40' },
      note: {
        ar: 'جاهز للتحويل — بانتظار جدولة الدفعة من المالية.',
        en: 'Ready for transfer — awaiting finance to schedule the payout.',
      },
      deliveryDays: [
        {
          id: 'd1',
          dateLabel: { ar: 'الأحد 13 يوليو', en: 'Sun 13 Jul' },
          boxes: 28,
          amountKd: 106.0,
        },
        {
          id: 'd2',
          dateLabel: { ar: 'الإثنين 14 يوليو', en: 'Mon 14 Jul' },
          boxes: 30,
          amountKd: 113.5,
        },
        {
          id: 'd3',
          dateLabel: { ar: 'الثلاثاء 15 يوليو', en: 'Tue 15 Jul' },
          boxes: 26,
          amountKd: 98.5,
        },
      ],
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'اكتمل تجميع التسليمات الأسبوعية',
            en: 'Weekly deliveries aggregation completed',
          },
          timeLabel: { ar: 'اليوم 09:40', en: 'Today 09:40' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: {
            ar: 'احتساب عمولة المطعم 15%',
            en: 'Restaurant commission 15% calculated',
          },
          timeLabel: { ar: 'اليوم 09:41', en: 'Today 09:41' },
          tone: 'neutral',
        },
        {
          id: 't3',
          title: {
            ar: 'البند معلّق بانتظار التحويل',
            en: 'Line pending payout transfer',
          },
          timeLabel: { ar: 'الآن', en: 'Now' },
          tone: 'warn',
        },
      ]),
    }),
    line({
      id: 'due-02',
      code: 'DUE-0726-W2',
      kind: 'meal_payable',
      status: 'scheduled',
      title: { ar: 'مستحق أسبوع 6–12 يوليو', en: 'Payable week 6–12 Jul' },
      detail: {
        ar: '112 صندوق مسلّم · مجدول للتحويل غدًا',
        en: '112 boxes delivered · scheduled for transfer tomorrow',
      },
      periodLabel: { ar: '6–12 يوليو', en: '6–12 Jul' },
      boxesDelivered: 112,
      grossKd: 424.0,
      commissionKd: 63.6,
      commissionRatePct: 15,
      netKd: 360.4,
      updatedAtLabel: { ar: 'أمس 18:20', en: 'Yesterday 18:20' },
      transferRef: 'SCH-0726-14',
      note: {
        ar: 'مجدول للتحويل البنكي غدًا صباحًا.',
        en: 'Scheduled for bank transfer tomorrow morning.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم احتساب المستحق', en: 'Payable calculated' },
          timeLabel: { ar: 'أمس 16:00', en: 'Yesterday 16:00' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: {
            ar: 'جُدول التحويل SCH-0726-14',
            en: 'Transfer scheduled SCH-0726-14',
          },
          timeLabel: { ar: 'أمس 18:20', en: 'Yesterday 18:20' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'due-03',
      code: 'DUE-0726-W1',
      kind: 'meal_payable',
      status: 'paid',
      title: { ar: 'مستحق أسبوع 1–5 يوليو', en: 'Payable week 1–5 Jul' },
      detail: {
        ar: '96 صندوق · تم التحويل TR-4412',
        en: '96 boxes · transferred TR-4412',
      },
      periodLabel: { ar: '1–5 يوليو', en: '1–5 Jul' },
      boxesDelivered: 96,
      grossKd: 362.75,
      commissionKd: 54.4,
      commissionRatePct: 15,
      netKd: 308.35,
      updatedAtLabel: { ar: '8 يوليو', en: '8 Jul' },
      transferRef: 'TR-4412',
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم التحويل البنكي', en: 'Bank transfer completed' },
          timeLabel: { ar: '8 يوليو', en: '8 Jul' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: {
            ar: 'خصم عمولة المطعم من الإجمالي',
            en: 'Restaurant commission deducted from gross',
          },
          timeLabel: { ar: '7 يوليو', en: '7 Jul' },
          tone: 'neutral',
        },
      ]),
    }),
    line({
      id: 'due-04',
      code: 'COM-0726',
      kind: 'commission',
      status: 'held',
      title: { ar: 'ملخص عمولة يوليو', en: 'July commission summary' },
      detail: {
        ar: 'مجموع عمولة المطعم المستقطعة هذا الشهر',
        en: 'Total restaurant commission withheld this month',
      },
      periodLabel: { ar: 'يوليو 2026', en: 'July 2026' },
      boxesDelivered: 292,
      grossKd: 1260.75,
      commissionKd: 189.1,
      commissionRatePct: 15,
      netKd: 0,
      updatedAtLabel: { ar: 'محدّث اليوم', en: 'Updated today' },
      note: {
        ar: 'عمولة المطعم فقط — ليست عمولة اشتراك العميل.',
        en: 'Restaurant commission only — not customer subscription commission.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'تحديث ملخص العمولة الشهري',
            en: 'Monthly commission summary updated',
          },
          timeLabel: { ar: 'اليوم', en: 'Today' },
          tone: 'neutral',
        },
      ]),
    }),
    line({
      id: 'due-05',
      code: 'NET-0626',
      kind: 'net_settlement',
      status: 'paid',
      title: { ar: 'صافي تسوية يونيو', en: 'June net settlement' },
      detail: {
        ar: 'بعد العمولة وخصومات الشكاوى المعتمدة',
        en: 'After commission and approved complaint deductions',
      },
      periodLabel: { ar: 'يونيو 2026', en: 'June 2026' },
      boxesDelivered: 268,
      grossKd: 1120.0,
      commissionKd: 168.0,
      commissionRatePct: 15,
      netKd: 914.5,
      updatedAtLabel: { ar: '2 يوليو', en: '2 Jul' },
      transferRef: 'TR-4388',
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'أُغلقت تسوية يونيو', en: 'June settlement closed' },
          timeLabel: { ar: '2 يوليو', en: '2 Jul' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'due-06',
      code: 'DUE-0626-W4',
      kind: 'meal_payable',
      status: 'held',
      title: {
        ar: 'مستحق معلّق لمراجعة شكوى',
        en: 'Payable held for complaint review',
      },
      detail: {
        ar: 'جزء من مستحق يونيو بانتظار إغلاق CMP-441',
        en: 'Part of June payable awaiting CMP-441 closure',
      },
      periodLabel: { ar: '24–30 يونيو', en: '24–30 Jun' },
      boxesDelivered: 18,
      grossKd: 68.0,
      commissionKd: 10.2,
      commissionRatePct: 15,
      netKd: 57.8,
      updatedAtLabel: { ar: 'منذ 3 أيام', en: '3d ago' },
      note: {
        ar: 'موقوف حتى إغلاق شكوى CMP-441 — قد يظهر خصم في صفحة الخصومات.',
        en: 'Held until complaint CMP-441 closes — a deduction may appear on deductions.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'إيقاف مؤقت بسبب شكوى CMP-441',
            en: 'Temporarily held due to complaint CMP-441',
          },
          timeLabel: { ar: 'منذ 3 أيام', en: '3d ago' },
          tone: 'danger',
        },
      ]),
    }),
    line({
      id: 'due-07',
      code: 'DUE-0626-W3',
      kind: 'meal_payable',
      status: 'paid',
      title: { ar: 'مستحق أسبوع 17–23 يونيو', en: 'Payable week 17–23 Jun' },
      detail: {
        ar: '78 صندوق · تحويل مكتمل',
        en: '78 boxes · transfer completed',
      },
      periodLabel: { ar: '17–23 يونيو', en: '17–23 Jun' },
      boxesDelivered: 78,
      grossKd: 295.5,
      commissionKd: 44.33,
      commissionRatePct: 15,
      netKd: 251.17,
      updatedAtLabel: { ar: '25 يونيو', en: '25 Jun' },
      transferRef: 'TR-4371',
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم التحويل', en: 'Transfer completed' },
          timeLabel: { ar: '25 يونيو', en: '25 Jun' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'due-08',
      code: 'DUE-0626-W2',
      kind: 'meal_payable',
      status: 'paid',
      title: { ar: 'مستحق أسبوع 10–16 يونيو', en: 'Payable week 10–16 Jun' },
      detail: {
        ar: '90 صندوق · تحويل مكتمل',
        en: '90 boxes · transfer completed',
      },
      periodLabel: { ar: '10–16 يونيو', en: '10–16 Jun' },
      boxesDelivered: 90,
      grossKd: 340.0,
      commissionKd: 51.0,
      commissionRatePct: 15,
      netKd: 289.0,
      updatedAtLabel: { ar: '18 يونيو', en: '18 Jun' },
      transferRef: 'TR-4355',
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم التحويل', en: 'Transfer completed' },
          timeLabel: { ar: '18 يونيو', en: '18 Jun' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'due-09',
      code: 'COM-0626',
      kind: 'commission',
      status: 'paid',
      title: { ar: 'ملخص عمولة يونيو', en: 'June commission summary' },
      detail: {
        ar: 'عمولة المطعم المستقطعة لشهر يونيو',
        en: 'Restaurant commission withheld for June',
      },
      periodLabel: { ar: 'يونيو 2026', en: 'June 2026' },
      boxesDelivered: 268,
      grossKd: 1120.0,
      commissionKd: 168.0,
      commissionRatePct: 15,
      netKd: 0,
      updatedAtLabel: { ar: '1 يوليو', en: '1 Jul' },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'أُغلق ملخص عمولة يونيو',
            en: 'June commission summary closed',
          },
          timeLabel: { ar: '1 يوليو', en: '1 Jul' },
          tone: 'ok',
        },
      ]),
    }),
  ],
};
