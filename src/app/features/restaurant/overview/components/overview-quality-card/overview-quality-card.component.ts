import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageSquareWarning, lucideStar } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import { OverviewQualitySnapshot } from '../../models/restaurant-overview.model';

@Component({
  selector: 'mm-overview-quality-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgIcon],
  templateUrl: './overview-quality-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ov-card mm-ov-quality block' },
  viewProviders: [provideIcons({ lucideMessageSquareWarning, lucideStar })],
})
export class OverviewQualityCardComponent {
  readonly quality = input.required<OverviewQualitySnapshot>();

  private readonly locale = inject(AppLocaleService);

  readonly title = computed(() =>
    this.locale.isRtl() ? 'الجودة والأداء' : 'Quality & performance',
  );
  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'تقييمات الوجبات والشكاوى المفتوحة'
      : 'Meal ratings and open complaints',
  );
  readonly viewLabel = computed(() =>
    this.locale.isRtl() ? 'التفاصيل' : 'Details',
  );
  readonly ratingLabel = computed(() =>
    this.locale.isRtl() ? 'متوسط التقييم' : 'Average rating',
  );
  readonly ratingsCountLabel = computed(() =>
    this.locale.isRtl()
      ? `${this.quality().ratingsCount} تقييم`
      : `${this.quality().ratingsCount} ratings`,
  );
  readonly complaintsLabel = computed(() =>
    this.locale.isRtl() ? 'شكاوى تحتاج رد' : 'Complaints needing reply',
  );
  readonly slaLabel = computed(() =>
    this.locale.isRtl()
      ? `SLA الرد: ${this.quality().responseSlaHours} ساعة`
      : `Reply SLA: ${this.quality().responseSlaHours}h`,
  );

  readonly stars = computed(() => {
    const rating = Math.round(this.quality().averageRating);
    return Array.from({ length: 5 }, (_, index) => index < rating);
  });
}
