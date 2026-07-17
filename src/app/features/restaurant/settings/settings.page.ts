import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideBuilding2,
  lucideCheck,
  lucideFileCheck,
  lucideGauge,
  lucideGlobe,
  lucideInfo,
  lucideMapPinned,
  lucideSettings,
  lucideShieldCheck,
  lucideUpload,
  lucideUserRound,
  lucideX,
} from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import {
  RestaurantOpsFiltersComponent,
  RestaurantOpsHeroComponent,
  RestaurantOpsToolbarComponent,
} from '@/shared/components/restaurant-workspace/restaurant-ops-ui.component';

import { pickLocale } from '../overview/overview-i18n';
import { SettingsFacade } from './data/settings.facade';
import { SettingsSkeletonComponent } from './settings-skeleton.component';
import {
  DocumentStatus,
  SettingsDocumentItem,
  SettingsOption,
  SettingsSectionId,
  SettingsToggle,
} from './models/settings.model';

interface SettingsSectionCard {
  id: SettingsSectionId;
  icon: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

@Component({
  selector: 'mm-settings-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    PageStateComponent,
    SettingsSkeletonComponent,
    RestaurantOpsHeroComponent,
  ],
  templateUrl: './settings.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-due-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideBuilding2,
      lucideCheck,
      lucideFileCheck,
      lucideGauge,
      lucideGlobe,
      lucideInfo,
      lucideMapPinned,
      lucideSettings,
      lucideShieldCheck,
      lucideUpload,
      lucideUserRound,
      lucideX,
    }),
  ],
})
export class SettingsPageComponent implements OnInit {
  readonly facade = inject(SettingsFacade);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeSection = signal<SettingsSectionId | null>(null);

  private readonly routeSection = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('section');
        return this.isSection(value) ? value : null;
      }),
    ),
    {
      initialValue: (() => {
        const value = this.route.snapshot.queryParamMap.get('section');
        return this.isSection(value) ? value : null;
      })(),
    },
  );

  readonly sections: SettingsSectionCard[] = [
    {
      id: 'account-security',
      icon: 'lucideShieldCheck',
      titleAr: 'الحساب والأمان',
      titleEn: 'Account & security',
      detailAr: 'البريد والجوال والجلسات',
      detailEn: 'Email, phone, and sessions',
    },
    {
      id: 'business-location',
      icon: 'lucideBuilding2',
      titleAr: 'الملف التجاري',
      titleEn: 'Business profile',
      detailAr: 'الشركة والموقع والتواصل',
      detailEn: 'Company, location, and contact',
    },
    {
      id: 'documents-settlement',
      icon: 'lucideFileCheck',
      titleAr: 'المستندات والتسوية',
      titleEn: 'Documents & settlement',
      detailAr: 'التراخيص والبنك والمناطق',
      detailEn: 'Licenses, bank, and areas',
    },
    {
      id: 'operations-notifications',
      icon: 'lucideGauge',
      titleAr: 'التشغيل والتنبيهات',
      titleEn: 'Ops & notifications',
      detailAr: 'قواعد وقنوات تنبيه',
      detailEn: 'Rules and alert channels',
    },
  ];

  readonly title = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.title, this.locale.locale()) : '';
  });

  readonly subtitle = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.subtitle, this.locale.locale()) : '';
  });

  readonly dateLabel = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.dateLabel, this.locale.locale()) : '';
  });

  readonly note = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.note, this.locale.locale()) : '';
  });

  readonly policyNote = computed(() => {
    const data = this.facade.data();
    return data ? pickLocale(data.policyNote, this.locale.locale()) : '';
  });

  readonly sectionTitle = computed(() => {
    const section = this.activeSection();
    if (!section) return '';
    const card = this.sections.find((item) => item.id === section);
    return card ? this.sectionCardTitle(card) : '';
  });

  readonly sectionSubtitle = computed(() => {
    const section = this.activeSection();
    if (!section) return '';
    const card = this.sections.find((item) => item.id === section);
    return card ? this.sectionCardDetail(card) : '';
  });

  readonly maskedIban = computed(() => {
    const iban = this.facade.draft()?.regions.iban ?? '';
    if (iban.length < 8) return iban;
    return `${iban.slice(0, 4)} •••• •••• ${iban.slice(-4)}`;
  });

  constructor() {
    effect(() => {
      this.activeSection.set(this.routeSection());
    });
  }

  ngOnInit(): void {
    this.facade.load();
    if (!this.route.snapshot.queryParamMap.get('section')) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { section: 'business-location' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  sectionCardTitle(card: SettingsSectionCard): string {
    return this.locale.isRtl() ? card.titleAr : card.titleEn;
  }

  sectionCardDetail(card: SettingsSectionCard): string {
    return this.locale.isRtl() ? card.detailAr : card.detailEn;
  }

  sectionCount(section: SettingsSectionId): number {
    const draft = this.facade.draft();
    if (!draft) return 0;
    switch (section) {
      case 'account-security':
        return 2 + draft.security.sessions.length + 2;
      case 'business-location':
        return 7 + 6;
      case 'documents-settlement':
        return draft.documents.length + 5 + draft.regions.serviceRegions.length;
      case 'operations-notifications':
        return draft.operationsToggles.length + draft.notificationToggles.length + 3;
      default:
        return 0;
    }
  }

  openSection(section: SettingsSectionId): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }

  closeSection(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: null },
      queryParamsHandling: 'merge',
    });
  }

  summaryLabel(card: { label: { ar: string; en: string } }): string {
    return pickLocale(card.label, this.locale.locale());
  }

  summaryValue(card: { value: { ar: string; en: string } }): string {
    return pickLocale(card.value, this.locale.locale());
  }

  summaryHint(card: { hint?: { ar: string; en: string } }): string {
    return card.hint ? pickLocale(card.hint, this.locale.locale()) : '';
  }

  optionLabel(option: SettingsOption): string {
    return pickLocale(option.label, this.locale.locale());
  }

  toggleLabel(toggle: SettingsToggle): string {
    return pickLocale(toggle.label, this.locale.locale());
  }

  toggleDetail(toggle: SettingsToggle): string {
    return pickLocale(toggle.detail, this.locale.locale());
  }

  docLabel(doc: SettingsDocumentItem): string {
    return pickLocale(doc.label, this.locale.locale());
  }

  docDetail(doc: SettingsDocumentItem): string {
    return doc.detail ? pickLocale(doc.detail, this.locale.locale()) : '';
  }

  docExpires(doc: SettingsDocumentItem): string {
    return doc.expiresAtLabel
      ? pickLocale(doc.expiresAtLabel, this.locale.locale())
      : '';
  }

  docStatusLabel(status: DocumentStatus): string {
    const rtl = this.locale.isRtl();
    switch (status) {
      case 'valid':
        return rtl ? 'ساري' : 'Valid';
      case 'expiring':
        return rtl ? 'ينتهي قريباً' : 'Expiring';
      case 'expired':
        return rtl ? 'منتهٍ' : 'Expired';
      case 'missing':
        return rtl ? 'ناقص' : 'Missing';
    }
  }

  localizedNote(note: { ar: string; en: string }): string {
    return pickLocale(note, this.locale.locale());
  }

  isRegionSelected(id: string): boolean {
    return !!this.facade.draft()?.regions.serviceRegions.includes(id);
  }

  onToggle(
    group: 'operations' | 'notifications',
    toggle: SettingsToggle,
    event: Event,
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.facade.setToggle(group, toggle.id, checked);
  }

  onTwoFactor(event: Event): void {
    this.facade.setTwoFactor((event.target as HTMLInputElement).checked);
  }

  onDocUpload(doc: SettingsDocumentItem): void {
    this.facade.setDocumentUploaded(doc.id, true);
  }

  onDocRemove(doc: SettingsDocumentItem): void {
    this.facade.setDocumentUploaded(doc.id, false);
  }

  save(): void {
    this.facade.save();
  }

  discard(): void {
    this.facade.discard();
  }

  private isSection(value: string | null): value is SettingsSectionId {
    return (
      value === 'account-security' ||
      value === 'business-location' ||
      value === 'documents-settlement' ||
      value === 'operations-notifications'
    );
  }
}
