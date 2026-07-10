import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownToLine,
  lucideArrowLeft,
  lucideArrowRight,
  lucideBanknote,
  lucideChartNoAxesCombined,
  lucideCheckCheck,
  lucideChefHat,
  lucideCircleAlert,
  lucideCircleDollarSign,
  lucideClock3,
  lucideFileText,
  lucideGauge,
  lucidePackageCheck,
  lucideQrCode,
  lucideReceipt,
  lucideStar,
  lucideTrendingDown,
  lucideTrendingUp,
  lucideTruck,
  lucideUtensils,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

type RestaurantOverviewDomain = 'operations' | 'finance' | 'quality';
type MetricTone = 'green' | 'amber' | 'blue' | 'red' | 'slate';

interface DomainMetric {
  labelAr: string;
  labelEn: string;
  value: string;
  delta: string;
  deltaDirection: 'up' | 'down' | 'neutral';
  icon: string;
  tone: MetricTone;
}

interface DomainQueueItem {
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  metaAr: string;
  metaEn: string;
  route: string;
  tone: 'critical' | 'warning' | 'info';
}

interface DomainProgressItem {
  labelAr: string;
  labelEn: string;
  value: string;
  percent: number;
  tone?: 'warning' | 'danger';
}

interface DomainPageData {
  eyebrowAr: string;
  eyebrowEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  trendTitleAr: string;
  trendTitleEn: string;
  trendDescriptionAr: string;
  trendDescriptionEn: string;
  trendLabelsAr: string[];
  trendLabelsEn: string[];
  trendValues: number[];
  trendSecondaryValues: number[];
  trendPrimaryAr: string;
  trendPrimaryEn: string;
  trendSecondaryAr: string;
  trendSecondaryEn: string;
  metrics: DomainMetric[];
  queueTitleAr: string;
  queueTitleEn: string;
  queueDescriptionAr: string;
  queueDescriptionEn: string;
  queue: DomainQueueItem[];
  breakdownTitleAr: string;
  breakdownTitleEn: string;
  breakdown: DomainProgressItem[];
  goalsTitleAr: string;
  goalsTitleEn: string;
  goals: DomainProgressItem[];
  activityAr: string[];
  activityEn: string[];
  reportRoute: string;
}

const WEEK_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const WEEK_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const DOMAIN_DATA: Record<RestaurantOverviewDomain, DomainPageData> = {
  operations: {
    eyebrowAr: 'الرئيسية · التشغيل', eyebrowEn: 'Overview · Operations',
    titleAr: 'تشغيل اليوم', titleEn: 'Daily operations',
    descriptionAr: 'تفاصيل الطلبات والسعة والتحضير والتسليم خلال اليوم.',
    descriptionEn: 'Detailed view of orders, capacity, preparation, and handover today.',
    trendTitleAr: 'حركة الطلبات خلال الأسبوع', trendTitleEn: 'Weekly order movement',
    trendDescriptionAr: 'الطلبات المستلمة مقابل المكتملة في موعدها', trendDescriptionEn: 'Received orders versus on-time completion',
    trendLabelsAr: WEEK_AR, trendLabelsEn: WEEK_EN,
    trendValues: [68, 74, 82, 72, 88, 96, 62], trendSecondaryValues: [64, 71, 78, 69, 84, 90, 60],
    trendPrimaryAr: 'مستلم', trendPrimaryEn: 'Received', trendSecondaryAr: 'مكتمل', trendSecondaryEn: 'Completed',
    metrics: [
      { labelAr: 'طلبات اليوم', labelEn: "Today's orders", value: '48', delta: '+12.4%', deltaDirection: 'up', icon: 'lucideReceipt', tone: 'green' },
      { labelAr: 'إجمالي الوجبات', labelEn: 'Total meals', value: '206', delta: '+18', deltaDirection: 'up', icon: 'lucideUtensils', tone: 'green' },
      { labelAr: 'الالتزام بالموعد', labelEn: 'On-time rate', value: '96.8%', delta: '+2.4%', deltaDirection: 'up', icon: 'lucideClock3', tone: 'blue' },
      { labelAr: 'استخدام السعة', labelEn: 'Capacity usage', value: '64%', delta: '206 / 320', deltaDirection: 'neutral', icon: 'lucideGauge', tone: 'slate' },
      { labelAr: 'بانتظار التأكيد', labelEn: 'Pending confirmation', value: '2', delta: 'أقرب مهلة 3 س', deltaDirection: 'neutral', icon: 'lucideCircleAlert', tone: 'amber' },
      { labelAr: 'بدون ملصقات', labelEn: 'Missing labels', value: '3', delta: 'قبل 12:15', deltaDirection: 'neutral', icon: 'lucideQrCode', tone: 'amber' },
      { labelAr: 'بانتظار سائق', labelEn: 'Waiting for driver', value: '1', delta: '18 دقيقة', deltaDirection: 'neutral', icon: 'lucideTruck', tone: 'blue' },
      { labelAr: 'مكتمل اليوم', labelEn: 'Completed today', value: '31', delta: '+8.1%', deltaDirection: 'up', icon: 'lucideCheckCheck', tone: 'green' },
    ],
    queueTitleAr: 'قائمة التشغيل الحرجة', queueTitleEn: 'Critical operations queue',
    queueDescriptionAr: 'الأعمال التي تحتاج تدخلاً قبل موعد التسليم', queueDescriptionEn: 'Actions requiring intervention before handover',
    queue: [
      { titleAr: 'طلبان يقتربان من مهلة التأكيد', titleEn: '2 confirmation deadlines approaching', detailAr: 'ORD-2491 و ORD-2493 خلال أقل من 3 ساعات', detailEn: 'ORD-2491 and ORD-2493 in under 3 hours', metaAr: 'حرج', metaEn: 'Critical', route: '/restaurant/orders/pending-confirmation', tone: 'critical' },
      { titleAr: '3 طلبات بدون ملصقات', titleEn: '3 orders missing labels', detailAr: 'أول استلام الساعة 12:15', detailEn: 'First pickup is at 12:15', metaAr: 'مطلوب اليوم', metaEn: 'Due today', route: '/restaurant/orders/labels', tone: 'warning' },
      { titleAr: 'طلب جاهز بدون سائق', titleEn: 'Ready order without driver', detailAr: 'ORD-2483 جاهز منذ 14 دقيقة', detailEn: 'ORD-2483 has been ready for 14 minutes', metaAr: 'متابعة', metaEn: 'Follow up', route: '/restaurant/delivery/drivers', tone: 'warning' },
      { titleAr: 'السعة المسائية وصلت 82%', titleEn: 'Evening capacity reached 82%', detailAr: 'يتبقى 34 وجبة قبل حد الإغلاق', detailEn: '34 meals remain before closing threshold', metaAr: 'معلومة', metaEn: 'Info', route: '/restaurant/operations/capacity', tone: 'info' },
    ],
    breakdownTitleAr: 'توزيع حالة الطلبات', breakdownTitleEn: 'Order status distribution',
    breakdown: [
      { labelAr: 'مؤكد', labelEn: 'Confirmed', value: '48 طلبًا', percent: 100 },
      { labelAr: 'قيد التحضير', labelEn: 'Preparing', value: '31 طلبًا', percent: 65 },
      { labelAr: 'جاهز', labelEn: 'Ready', value: '12 طلبًا', percent: 25 },
      { labelAr: 'تم التسليم', labelEn: 'Handed over', value: '5 طلبات', percent: 10 },
    ],
    goalsTitleAr: 'أهداف التشغيل', goalsTitleEn: 'Operational targets',
    goals: [
      { labelAr: 'الالتزام بالوقت', labelEn: 'On-time completion', value: '96.8% / 95%', percent: 97 },
      { labelAr: 'دقة تجهيز الطلب', labelEn: 'Order accuracy', value: '98.2% / 98%', percent: 98 },
      { labelAr: 'زمن التحضير', labelEn: 'Preparation time', value: '38د / 40د', percent: 95 },
      { labelAr: 'استخدام السعة', labelEn: 'Capacity utilization', value: '64% / 80%', percent: 80 },
    ],
    activityAr: ['تأكيد ORD-2490 تلقائيًا', 'طباعة 24 ملصق وجبة', 'تحديث السعة المسائية إلى 160', 'تسليم ORD-2478 للسائق', 'تعيين سائق للطلب ORD-2486'],
    activityEn: ['ORD-2490 auto-confirmed', '24 meal labels printed', 'Evening capacity updated to 160', 'ORD-2478 handed to driver', 'Driver assigned to ORD-2486'],
    reportRoute: '/restaurant/orders/daily',
  },
  finance: {
    eyebrowAr: 'الرئيسية · المالية', eyebrowEn: 'Overview · Finance',
    titleAr: 'النظرة المالية', titleEn: 'Finance overview',
    descriptionAr: 'المستحقات والعمولات والخصومات والدفعات في صورة قابلة للمراجعة.',
    descriptionEn: 'Reviewable view of dues, commissions, deductions, and payouts.',
    trendTitleAr: 'المستحقات خلال 7 أشهر', trendTitleEn: 'Payables over 7 months',
    trendDescriptionAr: 'إجمالي قيمة الوجبات مقابل صافي المستحق', trendDescriptionEn: 'Gross meal value versus net payable',
    trendLabelsAr: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'], trendLabelsEn: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    trendValues: [64, 70, 73, 78, 86, 92, 81], trendSecondaryValues: [52, 57, 61, 65, 72, 78, 69],
    trendPrimaryAr: 'إجمالي', trendPrimaryEn: 'Gross', trendSecondaryAr: 'صافي', trendSecondaryEn: 'Net',
    metrics: [
      { labelAr: 'صافي المستحق', labelEn: 'Net payable', value: '90,905', delta: '+11.6%', deltaDirection: 'up', icon: 'lucideWallet', tone: 'green' },
      { labelAr: 'قيمة الوجبات', labelEn: 'Meal value', value: '104,760', delta: '+9.8%', deltaDirection: 'up', icon: 'lucideCircleDollarSign', tone: 'blue' },
      { labelAr: 'عمولة المنصة', labelEn: 'Platform commission', value: '12,571', delta: '12%', deltaDirection: 'neutral', icon: 'lucideReceipt', tone: 'slate' },
      { labelAr: 'الخصومات', labelEn: 'Deductions', value: '1,284', delta: '-0.6%', deltaDirection: 'down', icon: 'lucideTrendingDown', tone: 'amber' },
      { labelAr: 'فواتير مستحقة', labelEn: 'Due invoices', value: '2', delta: 'يونيو ويوليو', deltaDirection: 'neutral', icon: 'lucideFileText', tone: 'amber' },
      { labelAr: 'دفعات مكتملة', labelEn: 'Completed payouts', value: '6', delta: '162,400 ر.س', deltaDirection: 'up', icon: 'lucideCheckCheck', tone: 'green' },
      { labelAr: 'متوسط الوجبة', labelEn: 'Average meal payable', value: '32.4', delta: '+1.2 ر.س', deltaDirection: 'up', icon: 'lucideBanknote', tone: 'blue' },
      { labelAr: 'الدفعة القادمة', labelEn: 'Next payout', value: '15 يوليو', delta: '8 أيام', deltaDirection: 'neutral', icon: 'lucideClock3', tone: 'slate' },
    ],
    queueTitleAr: 'يتطلب مراجعة مالية', queueTitleEn: 'Finance review queue',
    queueDescriptionAr: 'خصومات وفواتير وتحويلات تحتاج تحققًا', queueDescriptionEn: 'Deductions, invoices, and transfers needing review',
    queue: [
      { titleAr: 'خصم شكوى C-482', titleEn: 'Complaint deduction C-482', detailAr: 'خصم مقترح 420 ر.س بانتظار اعتماد المسؤولية', detailEn: 'SAR 420 proposed deduction pending responsibility decision', metaAr: 'مراجعة', metaEn: 'Review', route: '/restaurant/finance/deductions', tone: 'critical' },
      { titleAr: 'فاتورة يونيو جاهزة', titleEn: 'June invoice is ready', detailAr: '82,640 ر.س صافي بعد العمولة والخصومات', detailEn: 'SAR 82,640 net after commission and deductions', metaAr: 'جديد', metaEn: 'New', route: '/restaurant/finance/invoices', tone: 'info' },
      { titleAr: 'إيصال تحويل غير محمّل', titleEn: 'Transfer receipt not downloaded', detailAr: 'دفعة 38,200 ر.س بتاريخ 30 يونيو', detailEn: 'SAR 38,200 payout dated June 30', metaAr: 'تنبيه', metaEn: 'Notice', route: '/restaurant/finance/payouts', tone: 'warning' },
      { titleAr: 'فرق مطابقة 86 ر.س', titleEn: 'SAR 86 reconciliation difference', detailAr: 'فرق بين كشف الحساب وفاتورة مايو', detailEn: 'Difference between May invoice and statement', metaAr: 'تحقق', metaEn: 'Verify', route: '/restaurant/finance/statements', tone: 'warning' },
    ],
    breakdownTitleAr: 'تفصيل القيمة المالية', breakdownTitleEn: 'Financial value breakdown',
    breakdown: [
      { labelAr: 'قيمة الوجبات', labelEn: 'Meal value', value: '104,760 ر.س', percent: 100 },
      { labelAr: 'العمولة', labelEn: 'Commission', value: '12,571 ر.س', percent: 48 },
      { labelAr: 'خصومات الشكاوى', labelEn: 'Complaint deductions', value: '1,284 ر.س', percent: 18, tone: 'warning' },
      { labelAr: 'صافي المستحق', labelEn: 'Net payable', value: '90,905 ر.س', percent: 87 },
    ],
    goalsTitleAr: 'سلامة الدورة المالية', goalsTitleEn: 'Financial cycle health',
    goals: [
      { labelAr: 'مطابقة الفواتير', labelEn: 'Invoice reconciliation', value: '99.7%', percent: 99 },
      { labelAr: 'دفعات في الموعد', labelEn: 'On-time payouts', value: '100%', percent: 100 },
      { labelAr: 'وضوح الخصومات', labelEn: 'Deduction traceability', value: '96%', percent: 96 },
      { labelAr: 'إغلاق النزاعات', labelEn: 'Dispute resolution', value: '88%', percent: 88, tone: 'warning' },
    ],
    activityAr: ['إصدار فاتورة يونيو', 'تسجيل دفعة 38,200 ر.س', 'اعتماد خصم 164 ر.س', 'إغلاق كشف حساب مايو', 'تحديث نسبة العمولة إلى 12%'],
    activityEn: ['June invoice issued', 'SAR 38,200 payout recorded', 'SAR 164 deduction approved', 'May statement closed', 'Commission rate updated to 12%'],
    reportRoute: '/restaurant/finance/reports',
  },
  quality: {
    eyebrowAr: 'الرئيسية · الجودة', eyebrowEn: 'Overview · Quality',
    titleAr: 'الجودة والأداء', titleEn: 'Quality & performance',
    descriptionAr: 'التقييمات ودقة الطلبات والشكاوى ومؤشرات التحسين المستمر.',
    descriptionEn: 'Ratings, order accuracy, complaints, and continuous improvement indicators.',
    trendTitleAr: 'اتجاه التقييم الأسبوعي', trendTitleEn: 'Weekly rating trend',
    trendDescriptionAr: 'جودة الوجبة مقابل تجربة التسليم', trendDescriptionEn: 'Meal quality versus handover experience',
    trendLabelsAr: WEEK_AR, trendLabelsEn: WEEK_EN,
    trendValues: [82, 86, 90, 88, 94, 96, 92], trendSecondaryValues: [78, 81, 84, 86, 89, 91, 90],
    trendPrimaryAr: 'جودة الوجبة', trendPrimaryEn: 'Meal quality', trendSecondaryAr: 'التسليم', trendSecondaryEn: 'Handover',
    metrics: [
      { labelAr: 'متوسط التقييم', labelEn: 'Average rating', value: '4.8', delta: '+0.2', deltaDirection: 'up', icon: 'lucideStar', tone: 'green' },
      { labelAr: 'جودة الوجبة', labelEn: 'Meal quality', value: '4.9', delta: '+0.1', deltaDirection: 'up', icon: 'lucideChefHat', tone: 'green' },
      { labelAr: 'دقة الطلب', labelEn: 'Order accuracy', value: '98.2%', delta: '+1.3%', deltaDirection: 'up', icon: 'lucidePackageCheck', tone: 'blue' },
      { labelAr: 'الالتزام بالوقت', labelEn: 'On-time rate', value: '96.8%', delta: '+2.4%', deltaDirection: 'up', icon: 'lucideClock3', tone: 'blue' },
      { labelAr: 'معدل الشكاوى', labelEn: 'Complaint rate', value: '1.4%', delta: '-0.5%', deltaDirection: 'down', icon: 'lucideCircleAlert', tone: 'amber' },
      { labelAr: 'متوسط الحل', labelEn: 'Avg resolution', value: '4.2س', delta: '-38د', deltaDirection: 'down', icon: 'lucideCheckCheck', tone: 'green' },
      { labelAr: 'تقييمات 5 نجوم', labelEn: '5-star ratings', value: '82%', delta: '+6%', deltaDirection: 'up', icon: 'lucideStar', tone: 'green' },
      { labelAr: 'إعادة تجهيز', labelEn: 'Remake rate', value: '0.8%', delta: '-0.2%', deltaDirection: 'down', icon: 'lucideUtensils', tone: 'slate' },
    ],
    queueTitleAr: 'عناصر تحسين الجودة', queueTitleEn: 'Quality improvement queue',
    queueDescriptionAr: 'تقييمات وملاحظات تحتاج مراجعة أو إجراء', queueDescriptionEn: 'Ratings and feedback requiring review or action',
    queue: [
      { titleAr: 'تقييم نجمتين للطلب ORD-2469', titleEn: '2-star rating for ORD-2469', detailAr: 'ملاحظة على درجة حرارة الوجبة عند الاستلام', detailEn: 'Feedback about meal temperature at pickup', metaAr: 'حرج', metaEn: 'Critical', route: '/restaurant/quality/ratings', tone: 'critical' },
      { titleAr: '3 ملاحظات على التغليف', titleEn: '3 packaging observations', detailAr: 'تكررت خلال آخر 7 أيام على وجبة السلمون', detailEn: 'Repeated over 7 days for the salmon meal', metaAr: 'تحسين', metaEn: 'Improve', route: '/restaurant/quality/ratings', tone: 'warning' },
      { titleAr: 'زمن تحضير أعلى من الهدف', titleEn: 'Preparation time above target', detailAr: 'متوسط الفترة المسائية 46 دقيقة مقابل هدف 40', detailEn: 'Evening average is 46 minutes versus 40 target', metaAr: 'متابعة', metaEn: 'Follow up', route: '/restaurant/orders/daily', tone: 'warning' },
      { titleAr: 'وجبة الدجاج تحقق 4.9', titleEn: 'Chicken meal reached 4.9', detailAr: '326 طلبًا و98.7% دقة تجهيز', detailEn: '326 orders and 98.7% preparation accuracy', metaAr: 'متميز', metaEn: 'Excellent', route: '/restaurant/operations/menu', tone: 'info' },
    ],
    breakdownTitleAr: 'توزيع التقييمات', breakdownTitleEn: 'Rating distribution',
    breakdown: [
      { labelAr: '5 نجوم', labelEn: '5 stars', value: '82%', percent: 82 },
      { labelAr: '4 نجوم', labelEn: '4 stars', value: '13%', percent: 13 },
      { labelAr: '3 نجوم', labelEn: '3 stars', value: '3%', percent: 3 },
      { labelAr: 'نجمتان أو أقل', labelEn: '2 stars or less', value: '2%', percent: 2, tone: 'danger' },
    ],
    goalsTitleAr: 'أهداف الجودة', goalsTitleEn: 'Quality targets',
    goals: [
      { labelAr: 'التقييم العام', labelEn: 'Overall rating', value: '4.8 / 4.7', percent: 96 },
      { labelAr: 'دقة الطلب', labelEn: 'Order accuracy', value: '98.2% / 98%', percent: 98 },
      { labelAr: 'شكاوى أقل من 2%', labelEn: 'Complaints below 2%', value: '1.4%', percent: 86 },
      { labelAr: 'حل خلال 6 ساعات', labelEn: 'Resolve within 6h', value: '92%', percent: 92 },
    ],
    activityAr: ['إغلاق ملاحظة ORD-2451', 'وصول 12 تقييمًا جديدًا', 'تحديث معيار التغليف', 'تحسن تقييم السلمون إلى 4.8', 'تسجيل إعادة تجهيز لطلب واحد'],
    activityEn: ['ORD-2451 feedback closed', '12 new ratings received', 'Packaging standard updated', 'Salmon rating improved to 4.8', 'One order remake recorded'],
    reportRoute: '/restaurant/quality/ratings',
  },
};

@Component({
  selector: 'mm-restaurant-domain-overview-page',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './restaurant-domain-overview-page.component.html',
  styleUrl: './restaurant-domain-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowDownToLine, lucideArrowLeft, lucideArrowRight, lucideBanknote,
      lucideChartNoAxesCombined, lucideCheckCheck, lucideChefHat, lucideCircleAlert,
      lucideCircleDollarSign, lucideClock3, lucideFileText, lucideGauge,
      lucidePackageCheck, lucideQrCode, lucideReceipt, lucideStar,
      lucideTrendingDown, lucideTrendingUp, lucideTruck, lucideUtensils, lucideWallet,
    }),
  ],
})
export class RestaurantDomainOverviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly locale = inject(AppLocaleService);
  readonly domain = this.route.snapshot.data['domain'] as RestaurantOverviewDomain;
  readonly page = DOMAIN_DATA[this.domain];

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  directionIcon(): string {
    return this.locale.isRtl() ? 'lucideArrowLeft' : 'lucideArrowRight';
  }

  trendIcon(direction: DomainMetric['deltaDirection']): string {
    return direction === 'down' ? 'lucideTrendingDown' : 'lucideTrendingUp';
  }
}
