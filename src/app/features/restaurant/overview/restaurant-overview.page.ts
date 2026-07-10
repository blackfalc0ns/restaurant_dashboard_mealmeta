import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';

import { PageStateComponent } from '@/shared/components/page-state/page-state.component';

import { OverviewActivityFeedComponent } from './components/overview-activity-feed/overview-activity-feed.component';
import { OverviewCapacityCardComponent } from './components/overview-capacity-card/overview-capacity-card.component';
import { OverviewFinanceCardComponent } from './components/overview-finance-card/overview-finance-card.component';
import { OverviewKpiStripComponent } from './components/overview-kpi-strip/overview-kpi-strip.component';
import { OverviewOpsPanelComponent } from './components/overview-ops-panel/overview-ops-panel.component';
import { OverviewQualityCardComponent } from './components/overview-quality-card/overview-quality-card.component';
import { OverviewSkeletonComponent } from './components/overview-skeleton/overview-skeleton.component';
import { OverviewStatusBannerComponent } from './components/overview-status-banner/overview-status-banner.component';
import { RestaurantOverviewFacade } from './data/restaurant-overview.facade';

@Component({
  selector: 'mm-restaurant-overview-page',
  standalone: true,
  imports: [
    PageStateComponent,
    OverviewSkeletonComponent,
    OverviewStatusBannerComponent,
    OverviewKpiStripComponent,
    OverviewOpsPanelComponent,
    OverviewCapacityCardComponent,
    OverviewFinanceCardComponent,
    OverviewQualityCardComponent,
    OverviewActivityFeedComponent,
  ],
  templateUrl: './restaurant-overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-ov-page block',
  },
})
export class RestaurantOverviewPageComponent implements OnInit {
  readonly facade = inject(RestaurantOverviewFacade);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.facade.load();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }
}
