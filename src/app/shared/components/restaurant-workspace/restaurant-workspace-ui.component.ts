import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideActivity,
  lucideBadgeDollarSign,
  lucideCalendarDays,
  lucideCheck,
  lucideChefHat,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideClipboardList,
  lucideClock,
  lucideCookingPot,
  lucideFilePen,
  lucideLayers,
  lucideGauge,
  lucideInfo,
  lucidePackage,
  lucidePackageCheck,
  lucidePrinter,
  lucideQrCode,
  lucideScanBarcode,
  lucideSearch,
  lucideStar,
  lucideTimer,
  lucideTriangleAlert,
  lucideTruck,
  lucideUtensilsCrossed,
  lucideX,
} from '@ng-icons/lucide';

const WORKSPACE_ICONS = {
  lucideArchive,
  lucideActivity,
  lucideBadgeDollarSign,
  lucideCalendarDays,
  lucideCheck,
  lucideChefHat,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideClipboardList,
  lucideClock,
  lucideCookingPot,
  lucideFilePen,
  lucideLayers,
  lucideGauge,
  lucideInfo,
  lucidePackage,
  lucidePackageCheck,
  lucidePrinter,
  lucideQrCode,
  lucideScanBarcode,
  lucideSearch,
  lucideStar,
  lucideTimer,
  lucideTriangleAlert,
  lucideTruck,
  lucideUtensilsCrossed,
  lucideX,
};

@Component({
  selector: 'mm-workspace-header',
  standalone: true,
  imports: [NgIcon],
  template: `
    <header class="mm-ws-hero">
      <div class="mm-ws-hero__content">
        <p class="mm-ws-hero__eyebrow">
          <span><ng-icon [name]="icon()" class="size-4" /></span>
          {{ eyebrow() }}
        </p>
        <h1>{{ title() }}</h1>
        <p class="mm-ws-hero__subtitle">{{ subtitle() }}</p>
        <div class="mm-ws-hero__actions"><ng-content select="[workspaceActions]" /></div>
      </div>
      <ng-content select="[workspaceAside]" />
    </header>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(WORKSPACE_ICONS)],
})
export class RestaurantWorkspaceHeaderComponent {
  readonly icon = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}

@Component({
  selector: 'mm-workspace-stats',
  standalone: true,
  template: `<section class="mm-ws-stats"><ng-content /></section>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantWorkspaceStatsComponent {}

@Component({
  selector: 'mm-workspace-stat',
  standalone: true,
  imports: [NgIcon],
  template: `
    <article class="mm-ws-stat" [attr.data-tone]="tone()">
      <span class="mm-ws-stat__icon"><ng-icon [name]="icon()" class="size-4" /></span>
      <div>
        <small>{{ label() }}</small>
        <strong>{{ value() }}</strong>
        <span>{{ hint() }}</span>
      </div>
    </article>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(WORKSPACE_ICONS)],
})
export class RestaurantWorkspaceStatComponent {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly hint = input('');
  readonly tone = input('neutral');
}

@Component({
  selector: 'mm-workspace-toolbar',
  standalone: true,
  template: `<section class="mm-ws-toolbar"><ng-content /></section>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantWorkspaceToolbarComponent {}

@Component({
  selector: 'mm-workspace-filters',
  standalone: true,
  template: `<div class="mm-ws-filters" role="tablist"><ng-content /></div>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantWorkspaceFiltersComponent {}

@Component({
  selector: 'mm-workspace-panel',
  standalone: true,
  template: `<section class="mm-ws-panel"><ng-content /></section>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantWorkspacePanelComponent {}
