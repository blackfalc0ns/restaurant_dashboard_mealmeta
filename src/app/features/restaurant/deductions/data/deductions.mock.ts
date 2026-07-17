import {
  DeductionBox,
  DeductionLine,
  DeductionTimelineEvent,
  RestaurantDeductionsData,
} from '../models/deductions.model';

function timeline(
  events: Array<
    Pick<DeductionTimelineEvent, 'id' | 'title' | 'timeLabel' | 'tone'> &
      Partial<Pick<DeductionTimelineEvent, 'detail'>>
  >,
): DeductionTimelineEvent[] {
  return events;
}

function line(partial: DeductionLine): DeductionLine {
  return partial;
}

function box(partial: DeductionBox): DeductionBox {
  return partial;
}

const DED_01_BOXES: DeductionBox[] = [
  box({
    id: 'dbx-01',
    boxCode: 'BOX-2418-A',
    orderCode: 'ORD-2418',
    customerMaskedId: 'CUS-•••418',
    contentsLabel: { ar: 'غداء · بروتين', en: 'Lunch · protein' },
    zoneLabel: { ar: 'الشعب', en: 'Shaab' },
    deliveredAtLabel: { ar: '14 يوليو · 13:50', en: '14 Jul · 13:50' },
    unitPriceKd: 3.85,
    deductedKd: 3.85,
  }),
  box({
    id: 'dbx-02',
    boxCode: 'BOX-2420-A',
    orderCode: 'ORD-2420',
    customerMaskedId: 'CUS-•••420',
    contentsLabel: { ar: 'غداء · كيتو', en: 'Lunch · keto' },
    zoneLabel: { ar: 'السالمية', en: 'Salmiya' },
    deliveredAtLabel: { ar: '15 يوليو · 12:15', en: '15 Jul · 12:15' },
    unitPriceKd: 3.9,
    deductedKd: 1.95,
  }),
];

export const DEDUCTIONS_MOCK: RestaurantDeductionsData = {
  title: { ar: 'الخصومات والتسويات', en: 'Deductions & adjustments' },
  subtitle: {
    ar: 'خصومات الشكاوى والتسويات على مستحق البوكسات المسلّمة.',
    en: 'Complaint deductions and adjustments on delivered box payables.',
  },
  dateLabel: { ar: 'يوليو 2026', en: 'July 2026' },
  note: {
    ar: 'الخصم من مستحق المطعم فقط حسب البوكس. عمولة اشتراك العميل لا تظهر هنا.',
    en: 'Restaurant settlement deductions only, per box. Customer subscription commission is not shown.',
  },
  policyNote: {
    ar: 'بعد اعتماد الشكوى يُخصم من أقرب مستحق معلّق أو يُرحّل للتسوية التالية.',
    en: 'After complaint approval, the amount is deducted from the next pending payable or carried to the following settlement.',
  },
  summaries: [
    {
      id: 'open',
      label: { ar: 'خصم مفتوح', en: 'Open deductions' },
      valueKd: 12.4,
      hint: { ar: 'بانتظار الاعتماد', en: 'Awaiting approval' },
    },
    {
      id: 'applied',
      label: { ar: 'مطبّق هذا الشهر', en: 'Applied this month' },
      valueKd: 38.25,
      hint: { ar: 'خصم من المستحق', en: 'Taken from payables' },
    },
    {
      id: 'disputed',
      label: { ar: 'قيد الاعتراض', en: 'In dispute' },
      valueKd: 7.7,
      hint: { ar: 'مراجعة الجودة', en: 'Quality review' },
    },
    {
      id: 'reversed',
      label: { ar: 'مُعاد', en: 'Reversed' },
      valueKd: 3.85,
      hint: { ar: 'أُلغي الخصم', en: 'Deduction cancelled' },
    },
  ],
  lines: [
    line({
      id: 'ded-01',
      code: 'DED-0726-01',
      kind: 'complaint',
      status: 'pending',
      title: { ar: 'خصم شكوى جودة — CMP-441', en: 'Quality complaint deduction — CMP-441' },
      detail: {
        ar: 'بوكسان متأثران · بانتظار اعتماد المالية',
        en: '2 boxes affected · awaiting finance approval',
      },
      periodLabel: { ar: '14–15 يوليو', en: '14–15 Jul' },
      complaintCode: 'CMP-441',
      linkedDueCode: 'DUE-0726-W3',
      linkedDueId: 'due-01',
      boxesAffected: 2,
      grossKd: 7.75,
      amountKd: 5.8,
      coveragePct: 74.8,
      openedAtLabel: { ar: 'أمس 16:40', en: 'Yesterday 16:40' },
      updatedAtLabel: { ar: 'اليوم 11:20', en: 'Today 11:20' },
      decidedBy: { ar: 'بانتظار المالية', en: 'Awaiting finance' },
      reason: {
        ar: 'شكوى جودة معتمدة: درجة حرارة غير مناسبة في أحد البوكسات ونقص عنصر في الثاني. الاحتساب جزئي حسب سياسة الخصم.',
        en: 'Approved quality complaint: temperature issue on one box and a missing item on the second. Partial calculation per deduction policy.',
      },
      impactNote: {
        ar: 'عند الاعتماد سيُخصم 5.80 KD من مستحق DUE-0726-W3 قبل جدولة التحويل. لا يؤثر على عمولة اشتراك العميل.',
        en: 'Once approved, 5.80 KD will be taken from payable DUE-0726-W3 before payout scheduling. Customer subscription commission is unaffected.',
      },
      nextAction: {
        ar: 'اعتماد المالية خلال 24 ساعة أو طلب توضيح إضافي من الجودة.',
        en: 'Finance approval within 24 hours, or a follow-up clarification from quality.',
      },
      note: {
        ar: 'مرتبط بمستحق معلّق DUE-0726-W3 — قد يُخصم عند جدولة التحويل.',
        en: 'Linked to pending payable DUE-0726-W3 — may be deducted when payout is scheduled.',
      },
      boxes: DED_01_BOXES,
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'اعتماد شكوى CMP-441', en: 'Complaint CMP-441 approved' },
          timeLabel: { ar: 'أمس 16:40', en: 'Yesterday 16:40' },
          tone: 'warn',
          detail: {
            ar: 'فريق الجودة اعتمد الشكوى بعد مراجعة تقييم العميل وصور التسليم.',
            en: 'Quality approved the complaint after reviewing the customer rating and delivery photos.',
          },
        },
        {
          id: 't2',
          title: { ar: 'احتساب خصم على بوكسات متأثرة', en: 'Deduction calculated on affected boxes' },
          timeLabel: { ar: 'اليوم 09:10', en: 'Today 09:10' },
          tone: 'neutral',
          detail: {
            ar: 'BOX-2418-A كامل (3.85) + BOX-2420-A نصف (1.95) = 5.80 KD.',
            en: 'BOX-2418-A full (3.85) + BOX-2420-A half (1.95) = 5.80 KD.',
          },
        },
        {
          id: 't3',
          title: { ar: 'ربط بالمستحق المعلّق', en: 'Linked to pending payable' },
          timeLabel: { ar: 'اليوم 09:15', en: 'Today 09:15' },
          tone: 'neutral',
          detail: {
            ar: 'تم ربط البند بمستحق الأسبوع DUE-0726-W3 ليُخصم منه بعد الاعتماد.',
            en: 'Line linked to weekly payable DUE-0726-W3 for deduction after approval.',
          },
        },
        {
          id: 't4',
          title: { ar: 'بانتظار اعتماد الخصم', en: 'Awaiting deduction approval' },
          timeLabel: { ar: 'الآن', en: 'Now' },
          tone: 'warn',
          detail: {
            ar: 'المالية لم تعتمد الخصم بعد. التحويل الحالي لن يتأثر حتى الاعتماد.',
            en: 'Finance has not approved yet. The current transfer is unaffected until approval.',
          },
        },
      ]),
    }),
    line({
      id: 'ded-02',
      code: 'DED-0726-02',
      kind: 'quality',
      status: 'applied',
      title: { ar: 'خصم جودة مطبّق', en: 'Applied quality deduction' },
      detail: {
        ar: 'خصم بوكس واحد من مستحق أسبوع 6–12',
        en: 'One-box deduction from week 6–12 payable',
      },
      periodLabel: { ar: '8 يوليو', en: '8 Jul' },
      complaintCode: 'CMP-428',
      linkedDueCode: 'DUE-0726-W2',
      linkedDueId: 'due-02',
      boxesAffected: 1,
      grossKd: 3.8,
      amountKd: 3.8,
      coveragePct: 100,
      openedAtLabel: { ar: '8 يوليو', en: '8 Jul' },
      updatedAtLabel: { ar: '10 يوليو', en: '10 Jul' },
      decidedBy: { ar: 'المالية', en: 'Finance' },
      reason: {
        ar: 'تقييم جودة منخفض مع صورة تدعم الشكوى — خصم كامل لسعر البوكس.',
        en: 'Low quality rating with supporting photo — full box price deducted.',
      },
      impactNote: {
        ar: 'خُصم بالكامل من مستحق الأسبوع الماضي وأُغلق البند.',
        en: 'Fully deducted from last week’s payable; line is closed.',
      },
      nextAction: {
        ar: 'لا إجراء مطلوب — البند مطبّق.',
        en: 'No action required — line is applied.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم خصم المبلغ من المستحق', en: 'Amount deducted from payable' },
          timeLabel: { ar: '10 يوليو', en: '10 Jul' },
          tone: 'ok',
          detail: {
            ar: 'خُصم 3.80 KD من DUE-0726-W2.',
            en: '3.80 KD deducted from DUE-0726-W2.',
          },
        },
      ]),
    }),
    line({
      id: 'ded-03',
      code: 'DED-0726-03',
      kind: 'remake',
      status: 'applied',
      title: { ar: 'إعادة تحضير — خصم جزئي', en: 'Remake — partial deduction' },
      detail: {
        ar: 'إعادة بوكس · خصم 50% من سعر البوكس',
        en: 'Box remake · 50% of box price deducted',
      },
      periodLabel: { ar: '3 يوليو', en: '3 Jul' },
      complaintCode: 'CMP-419',
      linkedDueCode: 'DUE-0726-W1',
      linkedDueId: 'due-03',
      boxesAffected: 1,
      grossKd: 3.9,
      amountKd: 1.95,
      coveragePct: 50,
      openedAtLabel: { ar: '3 يوليو', en: '3 Jul' },
      updatedAtLabel: { ar: '5 يوليو', en: '5 Jul' },
      decidedBy: { ar: 'الجودة + المالية', en: 'Quality + finance' },
      reason: {
        ar: 'طلب إعادة تحضير مقبول — السياسة تخصم نصف سعر البوكس عند الإعادة.',
        en: 'Accepted remake request — policy deducts half the box price on remake.',
      },
      impactNote: {
        ar: 'خُصم 1.95 KD من مستحق الأسبوع 1–5.',
        en: '1.95 KD deducted from week 1–5 payable.',
      },
      nextAction: {
        ar: 'لا إجراء مطلوب.',
        en: 'No action required.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'اكتملت إعادة التحضير', en: 'Remake completed' },
          timeLabel: { ar: '4 يوليو', en: '4 Jul' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: { ar: 'خُصم نصف سعر البوكس', en: 'Half box price deducted' },
          timeLabel: { ar: '5 يوليو', en: '5 Jul' },
          tone: 'neutral',
          detail: {
            ar: 'تغطية الخصم 50% من سعر البوكس المتفق عليه.',
            en: 'Deduction coverage is 50% of the agreed box price.',
          },
        },
      ]),
    }),
    line({
      id: 'ded-04',
      code: 'DED-0726-04',
      kind: 'complaint',
      status: 'disputed',
      title: { ar: 'اعتراض على خصم شكوى', en: 'Disputed complaint deduction' },
      detail: {
        ar: 'المطعم يعترض على CMP-435',
        en: 'Restaurant disputing CMP-435',
      },
      periodLabel: { ar: '12 يوليو', en: '12 Jul' },
      complaintCode: 'CMP-435',
      linkedDueCode: 'DUE-0726-W3',
      linkedDueId: 'due-01',
      boxesAffected: 2,
      grossKd: 7.7,
      amountKd: 7.7,
      coveragePct: 100,
      openedAtLabel: { ar: '12 يوليو', en: '12 Jul' },
      updatedAtLabel: { ar: 'منذ يومين', en: '2d ago' },
      decidedBy: { ar: 'موقوف — اعتراض', en: 'On hold — dispute' },
      reason: {
        ar: 'المطعم يرى أن الصور لا تثبت المشكلة وأن التسليم كان ضمن المواصفات.',
        en: 'Restaurant argues photos do not prove the issue and delivery met the specs.',
      },
      impactNote: {
        ar: 'موقوف عن الخصم من التحويل الحالي حتى انتهاء الاعتراض.',
        en: 'Blocked from the current transfer until the dispute is resolved.',
      },
      nextAction: {
        ar: 'انتظار رد فريق الجودة على الاعتراض.',
        en: 'Waiting for quality’s reply on the dispute.',
      },
      note: {
        ar: 'موقوف حتى رد فريق الجودة — لا يُخصم من التحويل الحالي.',
        en: 'Held until quality replies — not deducted from the current transfer.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'فتح اعتراض من المطعم', en: 'Restaurant opened a dispute' },
          timeLabel: { ar: 'منذ يومين', en: '2d ago' },
          tone: 'danger',
          detail: {
            ar: 'تم تعليق الخصم وإبلاغ الجودة للمراجعة.',
            en: 'Deduction paused and quality notified for review.',
          },
        },
      ]),
    }),
    line({
      id: 'ded-05',
      code: 'DED-0626-08',
      kind: 'adjustment',
      status: 'reversed',
      title: { ar: 'تسوية معكوسة', en: 'Reversed adjustment' },
      detail: {
        ar: 'أُلغي خصم بعد مراجعة الإدارة',
        en: 'Deduction cancelled after admin review',
      },
      periodLabel: { ar: '28 يونيو', en: '28 Jun' },
      linkedDueCode: 'DUE-0626-W4',
      linkedDueId: 'due-06',
      boxesAffected: 1,
      grossKd: 3.85,
      amountKd: 3.85,
      coveragePct: 100,
      openedAtLabel: { ar: '28 يونيو', en: '28 Jun' },
      updatedAtLabel: { ar: '1 يوليو', en: '1 Jul' },
      decidedBy: { ar: 'الإدارة', en: 'Admin' },
      reason: {
        ar: 'تبيّن أن الخصم احتُسب مرتين لنفس الحالة.',
        en: 'Deduction was found to be double-counted for the same case.',
      },
      impactNote: {
        ar: 'أُعيد 3.85 KD إلى مستحق يونيو.',
        en: '3.85 KD restored to the June payable.',
      },
      nextAction: {
        ar: 'لا إجراء — البند مُعاد.',
        en: 'No action — line was reversed.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'أُعيد المبلغ للمستحق', en: 'Amount restored to payable' },
          timeLabel: { ar: '1 يوليو', en: '1 Jul' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'ded-06',
      code: 'DED-0626-05',
      kind: 'complaint',
      status: 'applied',
      title: { ar: 'خصم شكوى يونيو', en: 'June complaint deduction' },
      detail: {
        ar: '3 بوكسات · خُصم من تسوية يونيو',
        en: '3 boxes · deducted from June settlement',
      },
      periodLabel: { ar: '20–22 يونيو', en: '20–22 Jun' },
      complaintCode: 'CMP-401',
      linkedDueCode: 'DUE-0626-W3',
      linkedDueId: 'due-07',
      boxesAffected: 3,
      grossKd: 11.4,
      amountKd: 11.4,
      coveragePct: 100,
      openedAtLabel: { ar: '20 يونيو', en: '20 Jun' },
      updatedAtLabel: { ar: '25 يونيو', en: '25 Jun' },
      decidedBy: { ar: 'المالية', en: 'Finance' },
      reason: {
        ar: 'ثلاث شكاوى جودة مرتبطة بنفس الأسبوع — خصم كامل للبوكسات.',
        en: 'Three quality complaints in the same week — full box deductions.',
      },
      impactNote: {
        ar: 'أُغلق ضمن تسوية يونيو النهائية.',
        en: 'Closed inside the final June settlement.',
      },
      nextAction: {
        ar: 'لا إجراء مطلوب.',
        en: 'No action required.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'أُغلق الخصم ضمن تسوية يونيو', en: 'Closed within June settlement' },
          timeLabel: { ar: '25 يونيو', en: '25 Jun' },
          tone: 'ok',
        },
      ]),
    }),
    line({
      id: 'ded-07',
      code: 'DED-0726-05',
      kind: 'adjustment',
      status: 'pending',
      title: { ar: 'تسوية يدوية معلّقة', en: 'Pending manual adjustment' },
      detail: {
        ar: 'تعديل مالي بعد مراجعة فاتورة',
        en: 'Finance adjustment after invoice review',
      },
      periodLabel: { ar: '15 يوليو', en: '15 Jul' },
      linkedDueCode: 'DUE-0726-W3',
      linkedDueId: 'due-01',
      boxesAffected: 0,
      grossKd: 6.6,
      amountKd: 6.6,
      coveragePct: 100,
      openedAtLabel: { ar: 'اليوم 08:00', en: 'Today 08:00' },
      updatedAtLabel: { ar: 'اليوم 08:00', en: 'Today 08:00' },
      decidedBy: { ar: 'بانتظار الاعتماد', en: 'Awaiting approval' },
      reason: {
        ar: 'فروقات فاتورة تسوية يدوية بعد مطابقة التسليمات.',
        en: 'Manual settlement variance after delivery reconciliation.',
      },
      impactNote: {
        ar: 'سيُخصم من أقرب مستحق معلّق بعد الاعتماد.',
        en: 'Will be taken from the next pending payable after approval.',
      },
      nextAction: {
        ar: 'مراجعة المالية واعتماد التسوية.',
        en: 'Finance review and adjustment approval.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'إنشاء تسوية من المالية', en: 'Adjustment created by finance' },
          timeLabel: { ar: 'اليوم 08:00', en: 'Today 08:00' },
          tone: 'neutral',
        },
      ]),
    }),
    line({
      id: 'ded-08',
      code: 'DED-0626-02',
      kind: 'quality',
      status: 'applied',
      title: { ar: 'خصم جودة منتصف يونيو', en: 'Mid-June quality deduction' },
      detail: {
        ar: 'بوكس واحد · مطبّق',
        en: 'One box · applied',
      },
      periodLabel: { ar: '15 يونيو', en: '15 Jun' },
      complaintCode: 'CMP-388',
      linkedDueCode: 'DUE-0626-W2',
      linkedDueId: 'due-08',
      boxesAffected: 1,
      grossKd: 3.75,
      amountKd: 3.75,
      coveragePct: 100,
      openedAtLabel: { ar: '15 يونيو', en: '15 Jun' },
      updatedAtLabel: { ar: '18 يونيو', en: '18 Jun' },
      decidedBy: { ar: 'المالية', en: 'Finance' },
      reason: {
        ar: 'شكوى جودة معتمدة لبوكس واحد.',
        en: 'Approved quality complaint for one box.',
      },
      impactNote: {
        ar: 'خُصم من مستحق منتصف يونيو.',
        en: 'Deducted from the mid-June payable.',
      },
      nextAction: {
        ar: 'لا إجراء مطلوب.',
        en: 'No action required.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم التطبيق على المستحق', en: 'Applied to payable' },
          timeLabel: { ar: '18 يونيو', en: '18 Jun' },
          tone: 'ok',
        },
      ]),
    }),
  ],
};
