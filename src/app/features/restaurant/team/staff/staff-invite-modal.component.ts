import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideLoaderCircle,
  lucideMail,
  lucideTriangleAlert,
  lucideUserPlus,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import { pickLocale } from '../../overview/overview-i18n';
import { TeamFacade } from '../data/team.facade';
import { TeamRoleId } from '../models/team.model';

@Component({
  selector: 'mm-staff-invite-modal',
  standalone: true,
  imports: [FormsModule, NgIcon],
  templateUrl: './staff-invite-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideLoaderCircle,
      lucideMail,
      lucideTriangleAlert,
      lucideUserPlus,
      lucideX,
    }),
  ],
})
export class StaffInviteModalComponent {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);

  readonly closed = output<void>();

  readonly roles: { id: TeamRoleId; labelAr: string; labelEn: string }[] = [
    { id: 'viewer', labelAr: 'مشاهد', labelEn: 'Viewer' },
    { id: 'kitchen', labelAr: 'مطبخ', labelEn: 'Kitchen' },
    { id: 'finance', labelAr: 'مالية', labelEn: 'Finance' },
    { id: 'branch_manager', labelAr: 'مدير فرع', labelEn: 'Branch manager' },
  ];

  readonly branches = computed(() => this.facade.data()?.branches ?? []);

  readonly canSubmit = computed(() => {
    const draft = this.facade.inviteDraft();
    return (
      !!draft.fullNameAr.trim() &&
      !!draft.email.trim() &&
      !this.facade.saving()
    );
  });

  readonly errorMessage = computed(() => {
    const draft = this.facade.inviteDraft();
    if (draft.fullNameAr.trim() && draft.email.trim()) return '';
    return this.text('أدخل الاسم والبريد على الأقل.', 'Enter name and email at least.');
  });

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  roleLabel(role: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? role.labelAr : role.labelEn;
  }

  branchName(branch: { name: { ar: string; en: string } }): string {
    return pickLocale(branch.name, this.locale.locale());
  }

  close(): void {
    if (this.facade.saving()) return;
    this.facade.closeInviteForm();
    this.closed.emit();
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.facade.sendInvite();
  }
}
