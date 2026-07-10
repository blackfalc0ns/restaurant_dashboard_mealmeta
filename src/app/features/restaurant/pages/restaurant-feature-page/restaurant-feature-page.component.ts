import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

interface RestaurantFeaturePageData {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  features: string[];
}

@Component({
  selector: 'mm-restaurant-feature-page',
  standalone: true,
  templateUrl: './restaurant-feature-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantFeaturePageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly locale = inject(AppLocaleService);

  private readonly pageData = this.route.snapshot.data as RestaurantFeaturePageData;

  readonly title = computed(() =>
    this.locale.isRtl() ? this.pageData.titleAr : this.pageData.titleEn,
  );
  readonly description = computed(() =>
    this.locale.isRtl() ? this.pageData.descriptionAr : this.pageData.descriptionEn,
  );
  readonly statusLabel = computed(() =>
    this.locale.isRtl() ? 'قيد التجهيز' : 'In progress',
  );
  readonly blueprintLabel = computed(() =>
    this.locale.isRtl() ? 'مرجع المخطط' : 'Blueprint reference',
  );
  readonly features = this.pageData.features;
}
