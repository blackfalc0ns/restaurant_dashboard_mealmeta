import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideHistory,
  lucideMapPin,
  lucideNavigation,
  lucideRoute,
} from '@ng-icons/lucide';

const OPS_ICONS = {
  lucideChevronLeft,
  lucideChevronRight,
  lucideHistory,
  lucideMapPin,
  lucideNavigation,
  lucideRoute,
};

/** Light settings/list hero — shared ops style. */
@Component({
  selector: 'mm-ops-hero',
  standalone: true,
  imports: [NgIcon],
  template: `
    <header class="mm-ops-hero">
      <div class="mm-ops-hero__main">
        <p class="mm-ops-hero__eyebrow">
          <span><ng-icon [name]="icon()" class="size-4" /></span>
          {{ eyebrow() }}
        </p>
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
        <div class="mm-ops-hero__actions">
          <ng-content select="[opsActions]" />
        </div>
      </div>
      <div class="mm-ops-hero__metrics">
        <ng-content select="[opsMetrics]" />
      </div>
      <div class="mm-ops-hero__aside">
        <ng-content select="[opsAside]" />
      </div>
    </header>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(OPS_ICONS)],
})
export class RestaurantOpsHeroComponent {
  readonly icon = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
}

/** White content board. */
@Component({
  selector: 'mm-ops-board',
  standalone: true,
  template: `<section class="mm-ops-board"><ng-content /></section>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsBoardComponent {}

/** Toolbar row inside a board. */
@Component({
  selector: 'mm-ops-toolbar',
  standalone: true,
  template: `<div class="mm-ops-board__toolbar"><ng-content /></div>`,
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsToolbarComponent {}

/** Chip-style filter tabs. */
@Component({
  selector: 'mm-ops-filters',
  standalone: true,
  template: `<div class="mm-ops-filters" role="tablist"><ng-content /></div>`,
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsFiltersComponent {}

/** Shared pagination bar. */
@Component({
  selector: 'mm-ops-pager',
  standalone: true,
  imports: [NgIcon],
  template: `
    <nav class="mm-ops-pager" [attr.aria-label]="range()">
      <p class="mm-ops-pager__range">{{ range() }}</p>
      <div class="mm-ops-pager__controls">
        <button
          type="button"
          class="mm-ops-pager__nav"
          [disabled]="currentPage() <= 1"
          (click)="prev.emit()"
        >
          <ng-icon
            [name]="rtl() ? 'lucideChevronRight' : 'lucideChevronLeft'"
            class="size-4"
          />
          <span>{{ prevLabel() }}</span>
        </button>

        <div class="mm-ops-pager__pages">
          @for (pageNum of pages(); track pageNum) {
            <button
              type="button"
              class="mm-ops-pager__page"
              [class.is-active]="currentPage() === pageNum"
              (click)="goTo.emit(pageNum)"
            >
              {{ pageNum }}
            </button>
          }
        </div>

        <button
          type="button"
          class="mm-ops-pager__nav"
          [disabled]="currentPage() >= totalPages()"
          (click)="next.emit()"
        >
          <span>{{ nextLabel() }}</span>
          <ng-icon
            [name]="rtl() ? 'lucideChevronLeft' : 'lucideChevronRight'"
            class="size-4"
          />
        </button>
      </div>
    </nav>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(OPS_ICONS)],
})
export class RestaurantOpsPagerComponent {
  readonly range = input.required<string>();
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pages = input.required<number[]>();
  readonly rtl = input(true);
  readonly prevLabel = input('السابق');
  readonly nextLabel = input('التالي');

  readonly prev = output<void>();
  readonly next = output<void>();
  readonly goTo = output<number>();
}

/** Detail page hero shell. */
@Component({
  selector: 'mm-ops-detail-hero',
  standalone: true,
  imports: [NgIcon],
  template: `
    <header class="mm-ops-detail-hero" [attr.data-status]="status() || null">
      <ng-content select="[opsBack]" />

      <div class="mm-ops-detail-hero__body">
        <div class="mm-ops-detail-hero__title-row">
          <div class="mm-ops-detail-hero__identity">
            <span class="mm-ops-detail-hero__mark">
              <ng-icon [name]="icon()" class="size-5" />
            </span>
            <div>
              <div class="mm-ops-detail-hero__topline">
                <ng-content select="[opsBadge]" />
                @if (kicker()) {
                  <small>{{ kicker() }}</small>
                }
              </div>
              <h1>{{ title() }}</h1>
            </div>
          </div>
          <ng-content select="[opsActions]" />
        </div>

        @if (subtitle()) {
          <p class="mm-ops-detail-hero__subtitle">{{ subtitle() }}</p>
        }

        <div class="mm-ops-detail-hero__stats">
          <ng-content select="[opsStats]" />
        </div>
      </div>
    </header>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(OPS_ICONS)],
})
export class RestaurantOpsDetailHeroComponent {
  readonly icon = input('lucideMapPin');
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly kicker = input('');
  readonly status = input<string | null>(null);
}

@Component({
  selector: 'mm-ops-split',
  standalone: true,
  template: `<div class="mm-ops-split"><ng-content /></div>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsSplitComponent {}

@Component({
  selector: 'mm-ops-main',
  standalone: true,
  template: `<section class="mm-ops-main"><ng-content /></section>`,
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsMainComponent {}

@Component({
  selector: 'mm-ops-side',
  standalone: true,
  template: `<aside class="mm-ops-side"><ng-content /></aside>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsSideComponent {}

@Component({
  selector: 'mm-ops-side-card',
  standalone: true,
  template: `<section class="mm-ops-side-card"><ng-content /></section>`,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantOpsSideCardComponent {}

@Component({
  selector: 'mm-ops-section-head',
  standalone: true,
  imports: [NgIcon],
  template: `
    <div
      class="mm-ops-section-head"
      [class.mm-ops-section-head--compact]="compact()"
    >
      <div>
        @if (kicker()) {
          <p class="mm-ops-kicker">
            @if (kickerIcon()) {
              <ng-icon [name]="kickerIcon()!" class="size-3.5" />
            }
            {{ kicker() }}
          </p>
        }
        @if (title()) {
          <h2>{{ title() }}</h2>
        }
        <ng-content select="[opsHeadCopy]" />
      </div>
      <ng-content select="[opsHeadAside]" />
    </div>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(OPS_ICONS)],
})
export class RestaurantOpsSectionHeadComponent {
  readonly kicker = input('');
  readonly kickerIcon = input<string | null>(null);
  readonly title = input('');
  readonly compact = input(false);
}
