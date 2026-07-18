import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideLoaderCircle,
  lucideMail,
  lucideStore,
  lucideTriangleAlert,
  lucideUserPlus,
  lucideUserRound,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import { pickLocale } from '../../overview/overview-i18n';
import { TeamFacade } from '../data/team.facade';
import { BranchManagerMode } from '../models/team.model';

type BranchWizardStep = 1 | 2 | 3;

@Component({
  selector: 'mm-branch-form-modal',
  standalone: true,
  imports: [FormsModule, NgIcon],
  templateUrl: './branch-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideLoaderCircle,
      lucideMail,
      lucideStore,
      lucideTriangleAlert,
      lucideUserPlus,
      lucideUserRound,
      lucideX,
    }),
  ],
})
export class BranchFormModalComponent {
  readonly facade = inject(TeamFacade);
  readonly locale = inject(AppLocaleService);

  readonly closed = output<void>();
  readonly step = signal<BranchWizardStep>(1);

  readonly isEdit = computed(() => !!this.facade.editingBranchId());

  readonly title = computed(() =>
    this.isEdit()
      ? this.text('تعديل الفرع', 'Edit branch')
      : this.text('فرع جديد', 'New branch'),
  );

  readonly stepMeta = computed(() => {
    switch (this.step()) {
      case 1:
        return {
          label: this.text('بيانات الفرع', 'Branch details'),
          detail: this.text(
            'الاسم والموقع وحالة التشغيل',
            'Name, location, and operating status',
          ),
        };
      case 2:
        return {
          label: this.text('مدير الفرع', 'Branch manager'),
          detail: this.text(
            'اختر موجوداً أو ادعُ مديراً جديداً بالإيميل',
            'Pick an existing manager or invite a new one by email',
          ),
        };
      case 3:
        return {
          label: this.text('مراجعة وإرسال', 'Review & send'),
          detail: this.text(
            'تأكيد البيانات قبل الحفظ',
            'Confirm details before saving',
          ),
        };
    }
  });

  readonly managers = computed(() => {
    const current = this.facade.branchDraft().managerId;
    return this.facade
      .managerCandidates()
      .filter((member) => member.status !== 'disabled' || member.id === current);
  });

  readonly step1Valid = computed(() => {
    const draft = this.facade.branchDraft();
    return !!draft.nameAr.trim() && !!draft.code.trim();
  });

  readonly step2Valid = computed(() => {
    const draft = this.facade.branchDraft();
    if (draft.managerMode === 'none') return true;
    if (draft.managerMode === 'existing') return !!draft.managerId;
    return !!draft.inviteNameAr.trim() && !!draft.inviteEmail.trim();
  });

  readonly canGoNext = computed(() => {
    if (this.facade.saving()) return false;
    if (this.step() === 1) return this.step1Valid();
    if (this.step() === 2) return this.step2Valid();
    return this.step1Valid() && this.step2Valid();
  });

  readonly selectedManagerName = computed(() => {
    const draft = this.facade.branchDraft();
    if (draft.managerMode === 'invite') {
      return draft.inviteNameAr.trim() || draft.inviteEmail.trim();
    }
    if (draft.managerMode === 'existing' && draft.managerId) {
      const member = this.facade.staffById(draft.managerId);
      return member ? pickLocale(member.fullName, this.locale.locale()) : '';
    }
    return this.text('بدون مدير', 'No manager');
  });

  readonly selectedManagerEmail = computed(() => {
    const draft = this.facade.branchDraft();
    if (draft.managerMode === 'invite') return draft.inviteEmail.trim();
    if (draft.managerMode === 'existing' && draft.managerId) {
      return this.facade.staffById(draft.managerId)?.email ?? '';
    }
    return '';
  });

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  memberName(member: { fullName: { ar: string; en: string } }): string {
    return pickLocale(member.fullName, this.locale.locale());
  }

  roleName(roleId: string): string {
    const role = this.facade.data()?.roles.find((r) => r.id === roleId);
    return role ? pickLocale(role.name, this.locale.locale()) : roleId;
  }

  setMode(mode: BranchManagerMode): void {
    this.facade.patchBranchDraft({
      managerMode: mode,
      managerId: mode === 'existing' ? this.facade.branchDraft().managerId : '',
    });
  }

  close(): void {
    if (this.facade.saving()) return;
    this.step.set(1);
    this.facade.closeBranchForm();
    this.closed.emit();
  }

  back(): void {
    const current = this.step();
    if (current > 1) this.step.set((current - 1) as BranchWizardStep);
  }

  next(): void {
    if (!this.canGoNext()) return;
    const current = this.step();
    if (current < 3) this.step.set((current + 1) as BranchWizardStep);
  }

  submit(): void {
    if (!this.canGoNext() || this.step() !== 3) return;
    this.facade.saveBranch();
  }
}
