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
  lucideActivity,
  lucideArchive,
  lucideBadgeDollarSign,
  lucideBriefcaseBusiness,
  lucideCalendarDays,
  lucideChartColumn,
  lucideChartNoAxesCombined,
  lucideClipboardList,
  lucideClock,
  lucideCookingPot,
  lucideFileText,
  lucideGauge,
  lucideHandCoins,
  lucideKeyRound,
  lucideLandmark,
  lucideLayoutDashboard,
  lucideListTodo,
  lucideLogOut,
  lucideMapPinned,
  lucidePackage,
  lucidePanelLeftClose,
  lucidePanelLeftOpen,
  lucideQrCode,
  lucideReceipt,
  lucideRoute,
  lucideScanBarcode,
  lucideScrollText,
  lucideSettings,
  lucideStar,
  lucideStore,
  lucideTruck,
  lucideUserRound,
  lucideUsers,
  lucideUsersRound,
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
import { RestaurantAuthFacade } from '@/features/auth/state/auth.facade';

@Component({
  selector: 'mm-restaurant-sidebar',
  standalone: true,
  imports: [RouterLink, NgIcon],
  templateUrl: './restaurant-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-restaurant-sidebar-host',
    '[class.is-collapsed]': 'isCollapsed()',
    '[class.is-mobile]': 'layout.isMobile()',
    '[class.is-open]': 'layout.mobileNavOpen()',
  },
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideArchive,
      lucideBadgeDollarSign,
      lucideBriefcaseBusiness,
      lucideCalendarDays,
      lucideChartColumn,
      lucideChartNoAxesCombined,
      lucideClipboardList,
      lucideClock,
      lucideCookingPot,
      lucideFileText,
      lucideGauge,
      lucideHandCoins,
      lucideKeyRound,
      lucideLandmark,
      lucideLayoutDashboard,
      lucideListTodo,
      lucideLogOut,
      lucideMapPinned,
      lucidePackage,
      lucidePanelLeftClose,
      lucidePanelLeftOpen,
      lucideQrCode,
      lucideReceipt,
      lucideRoute,
      lucideScanBarcode,
      lucideScrollText,
      lucideSettings,
      lucideStar,
      lucideStore,
      lucideTruck,
      lucideUserRound,
      lucideUsers,
      lucideUsersRound,
      lucideUtensilsCrossed,
      lucideWallet,
    }),
  ],
})
export class RestaurantSidebarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(RestaurantAuthFacade);
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(RestaurantShellLayoutService);

  readonly navSections = RESTAURANT_NAV_SECTIONS;
  readonly settingsItem = RESTAURANT_SETTINGS_ITEM;
  readonly brandMarkSrc = BRAND_ASSETS.icon;
  readonly currentUrl = signal(this.router.url);
  readonly activeItemId = signal<string | null>(null);

  @HostBinding('style.width')
  get sidebarWidth(): string | null {
    if (this.layout.isMobile()) {
      return this.layout.mobileNavOpen() ? 'var(--mm-sidebar-expanded)' : '0px';
    }
    return this.isCollapsed() ? 'var(--mm-sidebar-collapsed)' : 'var(--mm-sidebar-expanded)';
  }

  readonly isCollapsed = computed(() => {
    if (this.layout.isMobile()) return false;
    return this.layout.userCollapsed();
  });

  readonly collapseLabel = computed(() =>
    this.locale.isRtl()
      ? this.isCollapsed()
        ? 'توسيع القائمة'
        : 'طي القائمة'
      : this.isCollapsed()
        ? 'Expand sidebar'
        : 'Collapse sidebar',
  );

  readonly logoutLabel = computed(() => (this.locale.isRtl() ? 'تسجيل الخروج' : 'Log out'));

  constructor() {
    effect(() => {
      const vp = this.layout.viewport();
      if (vp === 'tablet') this.layout.setUserCollapsed(true);
      else if (vp === 'desktop' || vp === 'wide') this.layout.setUserCollapsed(false);
    });

    effect(() => {
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

  label(item: RestaurantNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  isNavGroup(item: RestaurantNavItem): item is RestaurantNavItem & { children: RestaurantNavItem[] } {
    return !!item.children?.length;
  }

  isItemActive(item: RestaurantNavItem): boolean {
    return this.activeItemId() === item.id;
  }

  linkTone(item: RestaurantNavItem): 'green' | 'orange' | 'default' {
    if (item.id === 'settings' || item.id.includes('finance') || item.id === 'dues') return 'orange';
    return 'default';
  }

  onItemClick(item: RestaurantNavItem): void {
    this.activeItemId.set(item.id);
    this.closeMobileNav();
  }

  toggleCollapse(): void {
    this.layout.setUserCollapsed(!this.layout.userCollapsed());
  }

  onLogoClick(): void {
    if (this.layout.isMobile()) {
      this.closeMobileNav();
      return;
    }
    this.toggleCollapse();
  }

  closeMobileNav(): void {
    this.layout.closeMobileNav();
  }

  logout(): void {
    this.authFacade.logout();
  }

  sectionLinks(section: RestaurantNavSection): RestaurantNavItem[] {
    return section.items.flatMap((item) => {
      if (item.children?.length) return item.children;
      if (item.route) return [item];
      return [];
    });
  }

  private resolveActiveItemId(url: string): string | null {
    const path = url.split('?')[0];
    let best: RestaurantNavItem | null = null;

    for (const section of RESTAURANT_NAV_SECTIONS) {
      for (const item of this.sectionLinks(section)) {
        if (!item.route) continue;
        const itemPath = item.route.split('?')[0];
        if (path !== itemPath && !path.startsWith(itemPath + '/')) continue;
        if (!best || itemPath.length >= (best.route?.length ?? 0)) {
          best = item;
        }
      }
    }

    if (this.settingsItem.route) {
      const settingsPath = this.settingsItem.route.split('?')[0];
      if (path === settingsPath || path.startsWith(settingsPath + '/')) {
        return this.settingsItem.id;
      }
    }

    return best?.id ?? null;
  }
}
