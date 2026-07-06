import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideBriefcase,
  lucideCircleDot,
  lucideClock,
  lucideCrosshair,
  lucideFileText,
  lucideGauge,
  lucideLayers,
  lucideList,
  lucideLogOut,
  lucidePackage,
  lucidePlus,
  lucideQrCode,
  lucideReceipt,
  lucideSettings,
  lucideUtensilsCrossed,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { RestaurantShellLayoutService } from '@/core/layout/restaurant-shell-layout.service';
import {
  RESTAURANT_NAV_SECTIONS,
  RESTAURANT_SETTINGS_ITEM,
} from '@/core/navigation/restaurant-nav.config';
import { RestaurantNavItem, RestaurantNavSection } from '@/core/navigation/restaurant-nav.model';

@Component({
  selector: 'mm-restaurant-sidebar',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './restaurant-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-restaurant-sidebar-host',
    '[class.mm-restaurant-sidebar-host--panel-hidden]': '!showPanel()',
    '[class.mm-restaurant-sidebar-host--mobile]': 'layout.isMobile()',
    '[class.mm-restaurant-sidebar-host--overlay-open]': 'layout.mobileNavOpen()',
  },
  viewProviders: [
    provideIcons({
      lucideArchive,
      lucideBriefcase,
      lucideCircleDot,
      lucideClock,
      lucideCrosshair,
      lucideFileText,
      lucideGauge,
      lucideLayers,
      lucideList,
      lucideLogOut,
      lucidePackage,
      lucidePlus,
      lucideQrCode,
      lucideReceipt,
      lucideSettings,
      lucideUtensilsCrossed,
      lucideWallet,
    }),
  ],
})
export class RestaurantSidebarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(RestaurantShellLayoutService);

  readonly navSections = RESTAURANT_NAV_SECTIONS;
  readonly settingsItem = RESTAURANT_SETTINGS_ITEM;
  readonly brandMarkSrc = BRAND_ASSETS.icon;
  readonly currentUrl = signal(this.router.url);
  readonly activeItemId = signal<string | null>(null);
  readonly selectedSectionId = signal(RESTAURANT_NAV_SECTIONS[0].id);

  @HostBinding('style.width')
  get sidebarWidth(): string | null {
    if (this.layout.isMobile()) {
      return this.layout.mobileNavOpen() ? 'var(--mm-dual-sidebar-width)' : '0px';
    }
    return this.showPanel() ? 'var(--mm-dual-sidebar-width)' : 'var(--mm-sidebar-collapsed)';
  }

  readonly selectedSection = computed(
    () =>
      RESTAURANT_NAV_SECTIONS.find((s) => s.id === this.selectedSectionId()) ??
      RESTAURANT_NAV_SECTIONS[0],
  );

  readonly showPanel = computed(() => {
    if (this.layout.isMobile()) return this.layout.mobileNavOpen();
    if (this.layout.isTablet()) return !this.layout.userCollapsed();
    return true;
  });

  readonly logoutLabel = computed(() => (this.locale.isRtl() ? 'تسجيل الخروج' : 'Log out'));
  readonly addStatusLabel = computed(() => (this.locale.isRtl() ? 'إضافة حالة' : 'Add Status'));
  readonly addGroupLabel = computed(() => (this.locale.isRtl() ? 'إضافة تصنيف' : 'Add Group'));

  constructor() {
    effect(() => {
      const vp = this.layout.viewport();
      if (vp === 'tablet') this.layout.setUserCollapsed(true);
      else if (vp === 'desktop' || vp === 'wide') this.layout.setUserCollapsed(false);
    });

    effect(() => {
      const sectionId = this.resolveActiveSectionId(this.currentUrl());
      if (sectionId) this.selectedSectionId.set(sectionId);
      const itemId = this.resolveActiveItemId(this.currentUrl());
      if (itemId) this.activeItemId.set(itemId);
    });

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        this.layout.onRouteChange();
      });
  }

  sectionLabel(section: RestaurantNavSection): string {
    return this.locale.isRtl() ? section.labelAr : section.labelEn;
  }

  sectionIcon(section: RestaurantNavSection): string {
    return section.icon ?? 'lucideCrosshair';
  }

  label(item: RestaurantNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  isNavGroup(item: RestaurantNavItem): item is RestaurantNavItem & { children: RestaurantNavItem[] } {
    return !!item.children?.length;
  }

  isSectionSelected(section: RestaurantNavSection): boolean {
    return this.selectedSectionId() === section.id;
  }

  isItemActive(item: RestaurantNavItem): boolean {
    return this.activeItemId() === item.id;
  }

  selectSection(section: RestaurantNavSection): void {
    this.selectedSectionId.set(section.id);
    if (this.layout.isTablet()) this.layout.setUserCollapsed(false);
  }

  onItemClick(item: RestaurantNavItem): void {
    this.activeItemId.set(item.id);
    this.closeMobileNav();
  }

  closeMobileNav(): void {
    this.layout.closeMobileNav();
  }

  addActionLabel(item: RestaurantNavItem): string {
    const prefix = '+ ';
    const isStatus = item.id.includes('status') || item.id === 'daily-ops';
    return prefix + (isStatus ? this.addStatusLabel() : this.addGroupLabel());
  }

  formatCount(value?: number): string {
    return String(value ?? 0);
  }

  logout(): void {
    void this.router.navigate(['/restaurant/login']);
  }

  private resolveActiveSectionId(url: string): string | null {
    for (const section of RESTAURANT_NAV_SECTIONS) {
      if (this.sectionMatchesUrl(section, url)) return section.id;
    }
    return null;
  }

  private resolveActiveItemId(url: string): string | null {
    const path = url.split('?')[0];
    let best: RestaurantNavItem | null = null;

    for (const section of RESTAURANT_NAV_SECTIONS) {
      for (const item of this.flattenItems(section.items)) {
        if (!item.route) continue;
        const itemPath = item.route.split('?')[0];
        if (path !== itemPath && !path.startsWith(itemPath + '/')) continue;
        if (!best || itemPath.length >= (best.route?.length ?? 0)) {
          best = item;
        }
      }
    }

    if (!best) return null;

    const matches = this.flattenItems(
      RESTAURANT_NAV_SECTIONS.flatMap((s) => s.items),
    ).filter((i) => i.route?.split('?')[0] === path);

    if (matches.length > 1) {
      const child = matches.find((i) => i.id !== 'all-orders');
      return child?.id ?? best.id;
    }

    return best.id;
  }

  private flattenItems(items: RestaurantNavItem[]): RestaurantNavItem[] {
    return items.flatMap((item) => {
      if (item.children?.length) return item.children;
      if (item.route) return [item];
      return [];
    });
  }

  private sectionMatchesUrl(section: RestaurantNavSection, url: string): boolean {
    return section.items.some(
      (item) =>
        this.itemMatchesUrl(item, url) ||
        item.children?.some((child) => this.itemMatchesUrl(child, url)),
    );
  }

  private itemMatchesUrl(item: RestaurantNavItem, url: string): boolean {
    if (!item.route) return false;
    const path = url.split('?')[0];
    const itemPath = item.route.split('?')[0];
    return path === itemPath || path.startsWith(itemPath + '/');
  }
}
