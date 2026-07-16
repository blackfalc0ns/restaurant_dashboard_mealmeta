import {
  DriverDocument,
  DriverTimelineEvent,
  RestaurantDriver,
  RestaurantDriversData,
} from '../models/driver.model';

function docs(
  prefix: string,
  licenseStatus: DriverDocument['status'],
  vehicleStatus: DriverDocument['status'] = 'verified',
): DriverDocument[] {
  return [
    {
      id: `${prefix}-license`,
      kind: 'license',
      label: { ar: 'رخصة القيادة', en: 'Driving license' },
      status: licenseStatus,
      fileName: `${prefix}-license.pdf`,
      updatedAtLabel: { ar: 'رُفعت منذ أسبوع', en: 'Uploaded 1w ago' },
    },
    {
      id: `${prefix}-vehicle`,
      kind: 'vehicle',
      label: { ar: 'وثيقة المركبة', en: 'Vehicle document' },
      status: vehicleStatus,
      fileName: `${prefix}-vehicle.pdf`,
      updatedAtLabel: { ar: 'رُفعت منذ أسبوع', en: 'Uploaded 1w ago' },
    },
    {
      id: `${prefix}-id`,
      kind: 'identity',
      label: { ar: 'الهوية المدنية', en: 'Civil ID' },
      status: 'verified',
      fileName: `${prefix}-id.pdf`,
      updatedAtLabel: { ar: 'رُفعت منذ أسبوعين', en: 'Uploaded 2w ago' },
    },
  ];
}

function timeline(
  events: Array<
    Pick<DriverTimelineEvent, 'id' | 'title' | 'timeLabel' | 'tone'>
  >,
): DriverTimelineEvent[] {
  return events;
}

function driver(
  partial: Omit<
    RestaurantDriver,
    'vehicleType' | 'vehicleColor' | 'engineNumber' | 'joinedAtLabel' | 'documents' | 'timeline'
  > & {
    vehicleType: RestaurantDriver['vehicleType'];
    vehicleColor: RestaurantDriver['vehicleColor'];
    engineNumber: string;
    joinedAtLabel: RestaurantDriver['joinedAtLabel'];
    documents: DriverDocument[];
    timeline: DriverTimelineEvent[];
  },
): RestaurantDriver {
  return partial;
}

export const DRIVERS_MOCK: RestaurantDriversData = {
  title: { ar: 'السائقون', en: 'Drivers' },
  subtitle: {
    ar: 'راقب اعتماد الأدمن والتفعيل وتواريخ الرخص لسائقي المطعم.',
    en: 'Track admin approval, activation, and license dates for restaurant drivers.',
  },
  dateLabel: { ar: 'التوصيل والجودة', en: 'Delivery & quality' },
  note: {
    ar: 'لا يُسند أي طلب لسائق غير معتمد ومفعّل. الاعتماد النهائي للأدمن بعد التحقق المبدئي من المطعم.',
    en: 'Orders are only assigned to approved and enabled drivers. Final approval is by admin after the restaurant’s initial document check.',
  },
  summaries: [
    { id: 'active', label: { ar: 'مفعّلون', en: 'Active' }, value: 3 },
    { id: 'pending', label: { ar: 'بانتظار الاعتماد', en: 'Pending approval' }, value: 2 },
    { id: 'license', label: { ar: 'تنبيه رخصة', en: 'License alerts' }, value: 1 },
  ],
  drivers: [
    driver({
      id: 'drv-01',
      name: { ar: 'أحمد العتيبي', en: 'Ahmad Al-Otaibi' },
      phone: '+965 5001 2201',
      email: 'ahmad.driver@mealmate.kw',
      status: 'active',
      vehicleLabel: { ar: 'تويوتا يارس · أبيض', en: 'Toyota Yaris · White' },
      vehicleType: { ar: 'تويوتا يارس', en: 'Toyota Yaris' },
      vehicleColor: { ar: 'أبيض', en: 'White' },
      plateNumber: 'ك و ت 4521',
      engineNumber: 'ENG-88421-A',
      licenseNumber: 'DL-88421',
      licenseExpiryLabel: { ar: 'تنتهي 12 مارس 2027', en: 'Expires 12 Mar 2027' },
      licenseExpiringSoon: false,
      deliveriesToday: 6,
      deliveriesWeek: 38,
      updatedAtLabel: { ar: 'آخر نشاط منذ ساعة', en: 'Last active 1h ago' },
      joinedAtLabel: { ar: 'انضم 14 يناير 2026', en: 'Joined 14 Jan 2026' },
      documents: docs('drv-01', 'verified'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تم تفعيل السائق بعد اعتماد الأدمن', en: 'Driver enabled after admin approval' },
          timeLabel: { ar: 'منذ 3 أشهر', en: '3 months ago' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: { ar: 'الأدمن اعتمد الوثائق نهائيًا', en: 'Admin approved documents' },
          timeLabel: { ar: 'منذ 3 أشهر', en: '3 months ago' },
          tone: 'ok',
        },
        {
          id: 't3',
          title: { ar: 'المطعم أرسل الطلب للاعتماد', en: 'Restaurant submitted for approval' },
          timeLabel: { ar: 'منذ 3 أشهر', en: '3 months ago' },
          tone: 'neutral',
        },
      ]),
    }),
    driver({
      id: 'drv-02',
      name: { ar: 'خالد الشمري', en: 'Khaled Al-Shammari' },
      phone: '+965 5001 2208',
      email: 'khaled.driver@mealmate.kw',
      status: 'active',
      vehicleLabel: { ar: 'هيونداي أكسنت · رمادي', en: 'Hyundai Accent · Gray' },
      vehicleType: { ar: 'هيونداي أكسنت', en: 'Hyundai Accent' },
      vehicleColor: { ar: 'رمادي', en: 'Gray' },
      plateNumber: 'ك و ت 1180',
      engineNumber: 'ENG-77102-B',
      licenseNumber: 'DL-77102',
      licenseExpiryLabel: { ar: 'تنتهي 3 أغسطس 2026', en: 'Expires 3 Aug 2026' },
      licenseExpiringSoon: false,
      deliveriesToday: 4,
      deliveriesWeek: 29,
      updatedAtLabel: { ar: 'آخر نشاط منذ 20 دقيقة', en: 'Last active 20m ago' },
      joinedAtLabel: { ar: 'انضم 2 فبراير 2026', en: 'Joined 2 Feb 2026' },
      documents: docs('drv-02', 'verified'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'سائق نشط ومستلم طلبات', en: 'Driver active and receiving orders' },
          timeLabel: { ar: 'منذ ساعة', en: '1 hour ago' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: { ar: 'اعتماد الأدمن مكتمل', en: 'Admin approval completed' },
          timeLabel: { ar: 'منذ شهرين', en: '2 months ago' },
          tone: 'ok',
        },
      ]),
    }),
    driver({
      id: 'drv-03',
      name: { ar: 'سارة المطيري', en: 'Sara Al-Mutairi' },
      phone: '+965 5001 2244',
      email: 'sara.driver@mealmate.kw',
      status: 'license_alert',
      vehicleLabel: { ar: 'كيا ريو · أسود', en: 'Kia Rio · Black' },
      vehicleType: { ar: 'كيا ريو', en: 'Kia Rio' },
      vehicleColor: { ar: 'أسود', en: 'Black' },
      plateNumber: 'ك و ت 9033',
      engineNumber: 'ENG-55219-C',
      licenseNumber: 'DL-55219',
      licenseExpiryLabel: { ar: 'تنتهي خلال 9 أيام', en: 'Expires in 9 days' },
      licenseExpiringSoon: true,
      deliveriesToday: 2,
      deliveriesWeek: 17,
      updatedAtLabel: { ar: 'تنبيه رخصة منذ يومين', en: 'License alert 2d ago' },
      joinedAtLabel: { ar: 'انضم 20 نوفمبر 2025', en: 'Joined 20 Nov 2025' },
      note: {
        ar: 'الرخصة تقترب من الانتهاء — حدّث الوثيقة قبل الإيقاف التلقائي.',
        en: 'License is nearing expiry — update the document before auto-suspension.',
      },
      documents: docs('drv-03', 'expiring'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'تنبيه قرب انتهاء الرخصة', en: 'License expiry alert raised' },
          timeLabel: { ar: 'منذ يومين', en: '2 days ago' },
          tone: 'warn',
        },
        {
          id: 't2',
          title: { ar: 'السائق مفعّل ويستلم طلبات', en: 'Driver enabled and receiving orders' },
          timeLabel: { ar: 'منذ 4 أشهر', en: '4 months ago' },
          tone: 'ok',
        },
      ]),
    }),
    driver({
      id: 'drv-04',
      name: { ar: 'فهد الرشيدي', en: 'Fahad Al-Rashidi' },
      phone: '+965 5001 2290',
      email: 'fahad.driver@mealmate.kw',
      status: 'pending',
      vehicleLabel: { ar: 'نيسان صني · فضي', en: 'Nissan Sunny · Silver' },
      vehicleType: { ar: 'نيسان صني', en: 'Nissan Sunny' },
      vehicleColor: { ar: 'فضي', en: 'Silver' },
      plateNumber: 'ك و ت 6672',
      engineNumber: 'ENG-99110-D',
      licenseNumber: 'DL-99110',
      licenseExpiryLabel: { ar: 'تنتهي 18 يناير 2028', en: 'Expires 18 Jan 2028' },
      licenseExpiringSoon: false,
      deliveriesToday: 0,
      deliveriesWeek: 0,
      updatedAtLabel: { ar: 'أُرسل للأدمن منذ يوم', en: 'Sent to admin 1d ago' },
      joinedAtLabel: { ar: 'أُضيف 14 يوليو 2026', en: 'Added 14 Jul 2026' },
      note: {
        ar: 'بانتظار الموافقة النهائية من الأدمن.',
        en: 'Awaiting final admin approval.',
      },
      documents: docs('drv-04', 'pending', 'pending'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'أُرسل الطلب لاعتماد الأدمن', en: 'Submitted for admin approval' },
          timeLabel: { ar: 'منذ يوم', en: '1 day ago' },
          tone: 'warn',
        },
        {
          id: 't2',
          title: { ar: 'المطعم أكمل التحقق المبدئي من الوثائق', en: 'Restaurant completed initial document check' },
          timeLabel: { ar: 'منذ يومين', en: '2 days ago' },
          tone: 'neutral',
        },
      ]),
    }),
    driver({
      id: 'drv-05',
      name: { ar: 'نورة العجمي', en: 'Noura Al-Ajmi' },
      phone: '+965 5001 2311',
      email: 'noura.driver@mealmate.kw',
      status: 'pending',
      vehicleLabel: { ar: 'تويوتا كورولا · أزرق', en: 'Toyota Corolla · Blue' },
      vehicleType: { ar: 'تويوتا كورولا', en: 'Toyota Corolla' },
      vehicleColor: { ar: 'أزرق', en: 'Blue' },
      plateNumber: 'ك و ت 3301',
      engineNumber: 'ENG-44088-E',
      licenseNumber: 'DL-44088',
      licenseExpiryLabel: { ar: 'تنتهي 5 مايو 2027', en: 'Expires 5 May 2027' },
      licenseExpiringSoon: false,
      deliveriesToday: 0,
      deliveriesWeek: 0,
      updatedAtLabel: { ar: 'أُرسل للأدمن منذ 3 ساعات', en: 'Sent to admin 3h ago' },
      joinedAtLabel: { ar: 'أُضيف 15 يوليو 2026', en: 'Added 15 Jul 2026' },
      documents: docs('drv-05', 'pending', 'verified'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'بانتظار اعتماد الأدمن', en: 'Awaiting admin approval' },
          timeLabel: { ar: 'منذ 3 ساعات', en: '3 hours ago' },
          tone: 'warn',
        },
      ]),
    }),
    driver({
      id: 'drv-06',
      name: { ar: 'ماجد العنزي', en: 'Majed Al-Enezi' },
      phone: '+965 5001 2355',
      email: 'majed.driver@mealmate.kw',
      status: 'disabled',
      vehicleLabel: { ar: 'شيفروليه سبارك · أحمر', en: 'Chevrolet Spark · Red' },
      vehicleType: { ar: 'شيفروليه سبارك', en: 'Chevrolet Spark' },
      vehicleColor: { ar: 'أحمر', en: 'Red' },
      plateNumber: 'ك و ت 2144',
      engineNumber: 'ENG-22017-F',
      licenseNumber: 'DL-22017',
      licenseExpiryLabel: { ar: 'تنتهي 22 نوفمبر 2026', en: 'Expires 22 Nov 2026' },
      licenseExpiringSoon: false,
      deliveriesToday: 0,
      deliveriesWeek: 8,
      updatedAtLabel: { ar: 'عُطّل منذ أسبوع', en: 'Disabled 1w ago' },
      joinedAtLabel: { ar: 'انضم 8 ديسمبر 2025', en: 'Joined 8 Dec 2025' },
      note: {
        ar: 'معتمد من الأدمن لكن معطّل من المطعم حاليًا.',
        en: 'Admin-approved but currently disabled by the restaurant.',
      },
      documents: docs('drv-06', 'verified'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'المطعم عطّل السائق مؤقتًا', en: 'Restaurant temporarily disabled the driver' },
          timeLabel: { ar: 'منذ أسبوع', en: '1 week ago' },
          tone: 'neutral',
        },
        {
          id: 't2',
          title: { ar: 'اعتماد الأدمن مكتمل', en: 'Admin approval completed' },
          timeLabel: { ar: 'منذ 5 أشهر', en: '5 months ago' },
          tone: 'ok',
        },
      ]),
    }),
    driver({
      id: 'drv-07',
      name: { ar: 'ياسر البلوشي', en: 'Yasser Al-Balushi' },
      phone: '+965 5001 2388',
      email: 'yasser.driver@mealmate.kw',
      status: 'rejected',
      vehicleLabel: { ar: 'هيونداي i10 · أبيض', en: 'Hyundai i10 · White' },
      vehicleType: { ar: 'هيونداي i10', en: 'Hyundai i10' },
      vehicleColor: { ar: 'أبيض', en: 'White' },
      plateNumber: 'ك و ت 7788',
      engineNumber: 'ENG-10992-G',
      licenseNumber: 'DL-10992',
      licenseExpiryLabel: { ar: 'تنتهي 1 فبراير 2026', en: 'Expires 1 Feb 2026' },
      licenseExpiringSoon: true,
      deliveriesToday: 0,
      deliveriesWeek: 0,
      updatedAtLabel: { ar: 'رُفض منذ 4 أيام', en: 'Rejected 4d ago' },
      joinedAtLabel: { ar: 'أُضيف 8 يوليو 2026', en: 'Added 8 Jul 2026' },
      note: {
        ar: 'رفض الأدمن — صورة الرخصة غير واضحة. أعد رفع الوثائق.',
        en: 'Admin rejected — license photo is unclear. Re-upload documents.',
      },
      documents: docs('drv-07', 'rejected', 'pending'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'الأدمن رفض الطلب — صورة الرخصة غير واضحة', en: 'Admin rejected — license photo unclear' },
          timeLabel: { ar: 'منذ 4 أيام', en: '4 days ago' },
          tone: 'danger',
        },
        {
          id: 't2',
          title: { ar: 'أُرسل الطلب للاعتماد', en: 'Submitted for approval' },
          timeLabel: { ar: 'منذ أسبوع', en: '1 week ago' },
          tone: 'neutral',
        },
      ]),
    }),
    driver({
      id: 'drv-08',
      name: { ar: 'عمر الدوسري', en: 'Omar Al-Dosari' },
      phone: '+965 5001 2410',
      email: 'omar.driver@mealmate.kw',
      status: 'active',
      vehicleLabel: { ar: 'كيا بيكانتو · أصفر', en: 'Kia Picanto · Yellow' },
      vehicleType: { ar: 'كيا بيكانتو', en: 'Kia Picanto' },
      vehicleColor: { ar: 'أصفر', en: 'Yellow' },
      plateNumber: 'ك و ت 5519',
      engineNumber: 'ENG-66301-H',
      licenseNumber: 'DL-66301',
      licenseExpiryLabel: { ar: 'تنتهي 30 سبتمبر 2027', en: 'Expires 30 Sep 2027' },
      licenseExpiringSoon: false,
      deliveriesToday: 5,
      deliveriesWeek: 33,
      updatedAtLabel: { ar: 'آخر نشاط منذ 5 دقائق', en: 'Last active 5m ago' },
      joinedAtLabel: { ar: 'انضم 3 مارس 2026', en: 'Joined 3 Mar 2026' },
      documents: docs('drv-08', 'verified'),
      timeline: timeline([
        {
          id: 't1',
          title: { ar: 'أكمل 5 توصيلات اليوم', en: 'Completed 5 deliveries today' },
          timeLabel: { ar: 'منذ 5 دقائق', en: '5 minutes ago' },
          tone: 'ok',
        },
        {
          id: 't2',
          title: { ar: 'اعتماد الأدمن مكتمل', en: 'Admin approval completed' },
          timeLabel: { ar: 'منذ شهرين', en: '2 months ago' },
          tone: 'ok',
        },
      ]),
    }),
  ],
};
