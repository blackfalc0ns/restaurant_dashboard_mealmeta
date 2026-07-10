import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBell,
  lucideCheck,
  lucideClock3,
  lucideFileCheck2,
  lucideMail,
  lucideShieldCheck,
  lucideRefreshCw,
  lucideBuilding2,
} from '@ng-icons/lucide';

import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RestaurantAuthLocaleService } from '@/features/auth/state/auth-locale.service';

@Component({
  selector: 'mm-restaurant-under-review-page',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBell,
      lucideCheck,
      lucideClock3,
      lucideFileCheck2,
      lucideMail,
      lucideShieldCheck,
      lucideRefreshCw,
      lucideBuilding2,
    }),
  ],
  templateUrl: './restaurant-under-review-page.component.html',
  styleUrl: './restaurant-under-review-page.component.scss',
  host: {
    class: 'block min-h-dvh',
    '[attr.dir]': 'locale.dir()',
    '[attr.lang]': 'locale.locale()',
  },
})
export class RestaurantUnderReviewPageComponent {
  private readonly router = inject(Router);
  readonly locale = inject(RestaurantAuthLocaleService);

  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly referenceCode = 'MM-RV-48291';

  readonly copy = computed(() => {
    const rtl = this.locale.isRtl();
    return {
      statusBadge: rtl ? 'تحت المراجعة والتدقيق' : 'Under active verification',
      title: rtl ? 'طلب انضمامك قيد المراجعة النشطة' : 'Your application is under active review',
      description: rtl
        ? 'يقوم فريق الجودة والامتثال في MealMate بالتحقق من المستندات والبيانات المدخلة لضمان مطابقتها لمعايير المنصة وتجهيز حسابكم للتشغيل.'
        : 'MealMate\'s compliance and quality team is currently verifying your submitted documents and details to ensure they meet platform standards and prepare your account for operations.',
      referenceLabel: rtl ? 'رقم الطلب المرجعي' : 'Application Reference',
      etaLabel: rtl ? 'الوقت المتوقع للاعتماد' : 'Estimated Approval Time',
      etaValue: rtl ? '٢٤ - ٤٨ ساعة عمل' : '24 - 48 business hours',
      nextTitle: rtl ? 'مراحل مراجعة الطلب' : 'Application Review Stages',
      steps: rtl
        ? [
            {
              icon: 'lucideFileCheck2',
              title: 'استلام وتدقيق البيانات',
              detail: 'تم التحقق من اكتمال وصحة الحقول الأساسية للطلب',
              status: 'done',
            },
            {
              icon: 'lucideShieldCheck',
              title: 'مراجعة الوثائق والامتثال',
              detail: 'جاري مطابقة السجل التجاري والتراخيص الصحية والموقع',
              status: 'active',
            },
            {
              icon: 'lucideBell',
              title: 'تفعيل الحساب والتشغيل',
              detail: 'تفعيل لوحة التحكم وجدولة استلام الوجبات',
              status: 'pending',
            },
          ]
        : [
            {
              icon: 'lucideFileCheck2',
              title: 'Data & Details Audit',
              detail: 'Basic application fields verified and validated successfully',
              status: 'done',
            },
            {
              icon: 'lucideShieldCheck',
              title: 'Document & Compliance Review',
              detail: 'Verifying commercial register, health licenses, and location',
              status: 'active',
            },
            {
              icon: 'lucideBell',
              title: 'Account Activation & Go-Live',
              detail: 'Activating your dashboard and scheduling meal handovers',
              status: 'pending',
            },
          ],
      docChecklistTitle: rtl ? 'حالة المستندات المرفقة' : 'Submitted Documents Status',
      documents: rtl
        ? [
            { name: 'السجل التجاري', status: 'verified', statusLabel: 'تم التحقق' },
            { name: 'الترخيص الصحي والغذائي', status: 'reviewing', statusLabel: 'قيد التدقيق' },
            { name: 'عقد التأسيس / الترخيص التجاري', status: 'verified', statusLabel: 'تم التحقق' },
            { name: 'بيانات الحساب البنكي (IBAN)', status: 'reviewing', statusLabel: 'قيد التدقيق' },
          ]
        : [
            { name: 'Commercial Register (CR)', status: 'verified', statusLabel: 'Verified' },
            { name: 'Health & Food License', status: 'reviewing', statusLabel: 'Reviewing' },
            { name: 'Articles of Association', status: 'verified', statusLabel: 'Verified' },
            { name: 'Bank Account & IBAN Details', status: 'reviewing', statusLabel: 'Reviewing' },
          ],
      tipTitle: rtl ? 'ملاحظة هامة' : 'Important Note',
      tipBody: rtl
        ? 'قد يتصل بك ممثل من فريق القبول عبر الهاتف أو البريد الإلكتروني لاستيضاح بعض البيانات لتسريع عملية تفعيل المطعم.'
        : 'An onboarding representative might contact you via phone or email to clarify some details and speed up your activation process.',
      primaryCta: rtl ? 'الذهاب لتسجيل الدخول' : 'Go to sign in',
      secondaryCta: rtl ? 'التحدث مع الدعم الفني' : 'Contact onboarding support',
      supportMail: 'onboarding@mealmate.app',
      liveTracker: rtl ? 'مؤشر المراجعة المباشر' : 'Live Verification Tracker',
      overallProgress: rtl ? 'نسبة اكتمال التدقيق' : 'Overall Audit Progress',
    };
  });

  directionIcon(): string {
    return this.locale.isRtl() ? 'lucideArrowLeft' : 'lucideArrowRight';
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/restaurant/login');
  }

  toggleLocale(): void {
    this.locale.toggle();
  }
}
