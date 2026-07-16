import {
  DispatchOfficer,
  DispatchOfficersData,
  DispatchOfficerTimelineEvent,
} from '../models/dispatch-officer.model';

function timeline(
  events: Array<
    Pick<DispatchOfficerTimelineEvent, 'id' | 'title' | 'timeLabel' | 'tone'>
  >,
): DispatchOfficerTimelineEvent[] {
  return events;
}

function officer(partial: DispatchOfficer): DispatchOfficer {
  return partial;
}

export const DISPATCH_OFFICERS_MOCK: DispatchOfficersData = {
  title: { ar: 'مسئولو التوصيل', en: 'Dispatch officers' },
  subtitle: {
    ar: 'المطعم ينشئ حسابات مسئولي التوصيل. إنشاء الرحلات يتم من تطبيق الموبايل الخاص بهم.',
    en: 'The restaurant creates dispatch officer accounts. Trips are created in their mobile app.',
  },
  dateLabel: { ar: 'التوصيل والجودة', en: 'Delivery & quality' },
  note: {
    ar: 'مسئول التوصيل يستخدم تطبيقًا منفصلًا لتجميع البوكسات وإنشاء الرحلات وتعيين السائقين. من اللوحة هنا تُدار الحسابات فقط.',
    en: 'Dispatch officers use a separate mobile app to group boxes, create trips, and assign drivers. This dashboard only manages their accounts.',
  },
  summaries: [
    { id: 'active', label: { ar: 'مفعّلون', en: 'Active' }, value: 2 },
    { id: 'invited', label: { ar: 'مدعوّون', en: 'Invited' }, value: 1 },
    { id: 'disabled', label: { ar: 'معطّلون', en: 'Disabled' }, value: 1 },
  ],
  officers: [
    officer({
      id: 'dsp-01',
      name: { ar: 'نورة العجمي', en: 'Noura Al-Ajmi' },
      phone: '+965 5002 1101',
      email: 'noura.dispatch@mealmate.kw',
      status: 'active',
      tripsCreatedToday: 4,
      tripsCreatedWeek: 22,
      updatedAtLabel: { ar: 'آخر نشاط منذ 20 د', en: 'Last active 20m ago' },
      joinedAtLabel: { ar: 'أُنشئ 2 فبراير 2026', en: 'Created 2 Feb 2026' },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'دخل تطبيق مسئول التوصيل',
            en: 'Signed into the dispatch mobile app',
          },
          timeLabel: { ar: 'منذ 20 دقيقة', en: '20m ago' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: {
            ar: 'أنشأ رحلة TRP-101 وعيّن أحمد العتيبي',
            en: 'Created trip TRP-101 and assigned Ahmad Al-Otaibi',
          },
          timeLabel: { ar: 'منذ ساعة', en: '1h ago' },
          tone: 'ok',
        },
        {
          id: 't3',
          title: {
            ar: 'أنشأ رحلة TRP-102 وعيّن سارة المطيري',
            en: 'Created trip TRP-102 and assigned Sara Al-Mutairi',
          },
          timeLabel: { ar: 'منذ 3 ساعات', en: '3h ago' },
          tone: 'ok',
        },
        {
          id: 't4',
          title: {
            ar: 'أكمل رحلة TRP-088 من التطبيق',
            en: 'Completed trip TRP-088 from the app',
          },
          timeLabel: { ar: 'أمس', en: 'Yesterday' },
          tone: 'neutral',
        },
        {
          id: 't5',
          title: {
            ar: 'المطعم أنشأ الحساب',
            en: 'Restaurant created the account',
          },
          timeLabel: { ar: 'منذ 5 أشهر', en: '5 months ago' },
          tone: 'neutral',
        },
      ]),
    }),
    officer({
      id: 'dsp-02',
      name: { ar: 'خالد الرشيدي', en: 'Khaled Al-Rashidi' },
      phone: '+965 5002 1108',
      email: 'khaled.dispatch@mealmate.kw',
      status: 'active',
      tripsCreatedToday: 2,
      tripsCreatedWeek: 15,
      updatedAtLabel: { ar: 'آخر نشاط منذ 2 س', en: 'Last active 2h ago' },
      joinedAtLabel: { ar: 'أُنشئ 18 مارس 2026', en: 'Created 18 Mar 2026' },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'أنشأ رحلة مسائية من التطبيق',
            en: 'Created an evening trip from the app',
          },
          timeLabel: { ar: 'منذ ساعتين', en: '2h ago' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: {
            ar: 'المطعم أنشأ الحساب',
            en: 'Restaurant created the account',
          },
          timeLabel: { ar: 'منذ 4 أشهر', en: '4 months ago' },
          tone: 'neutral',
        },
      ]),
    }),
    officer({
      id: 'dsp-03',
      name: { ar: 'سارة البلوشي', en: 'Sara Al-Balushi' },
      phone: '+965 5002 1120',
      email: 'sara.dispatch@mealmate.kw',
      status: 'invited',
      tripsCreatedToday: 0,
      tripsCreatedWeek: 0,
      updatedAtLabel: { ar: 'دُعيت أمس', en: 'Invited yesterday' },
      joinedAtLabel: { ar: 'أُنشئ أمس', en: 'Created yesterday' },
      note: {
        ar: 'بانتظار أول دخول لتطبيق مسئول التوصيل.',
        en: 'Awaiting first login to the dispatch mobile app.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'المطعم أرسل دعوة الحساب',
            en: 'Restaurant sent the account invite',
          },
          timeLabel: { ar: 'أمس', en: 'Yesterday' },
          tone: 'warn',
        },
      ]),
    }),
    officer({
      id: 'dsp-04',
      name: { ar: 'ماجد الدوسري', en: 'Majed Al-Dosari' },
      phone: '+965 5002 1133',
      email: 'majed.dispatch@mealmate.kw',
      status: 'disabled',
      tripsCreatedToday: 0,
      tripsCreatedWeek: 3,
      updatedAtLabel: { ar: 'عُطّل منذ يومين', en: 'Disabled 2d ago' },
      joinedAtLabel: { ar: 'أُنشئ 9 يناير 2026', en: 'Created 9 Jan 2026' },
      note: {
        ar: 'معطّل من المطعم — لا يمكنه إنشاء رحلات من التطبيق.',
        en: 'Disabled by the restaurant — cannot create trips from the app.',
      },
      timeline: timeline([
        {
          id: 't1',
          title: {
            ar: 'المطعم عطّل الحساب',
            en: 'Restaurant disabled the account',
          },
          timeLabel: { ar: 'منذ يومين', en: '2d ago' },
          tone: 'danger',
        },
        {
          id: 't2',
          title: {
            ar: 'المطعم أنشأ الحساب',
            en: 'Restaurant created the account',
          },
          timeLabel: { ar: 'منذ 6 أشهر', en: '6 months ago' },
          tone: 'neutral',
        },
      ]),
    }),
  ],
};
