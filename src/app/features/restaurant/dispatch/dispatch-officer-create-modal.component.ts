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
  lucideCheck,
  lucideLoaderCircle,
  lucideSmartphone,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import { DispatchOfficersFacade } from './data/dispatch-officers.facade';

@Component({
  selector: 'mm-dispatch-officer-create-modal',
  standalone: true,
  imports: [FormsModule, NgIcon],
  templateUrl: './dispatch-officer-create-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideLoaderCircle,
      lucideSmartphone,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class DispatchOfficerCreateModalComponent {
  readonly facade = inject(DispatchOfficersFacade);
  readonly locale = inject(AppLocaleService);

  readonly closed = output<void>();
  readonly created = output<string>();

  readonly nameAr = signal('');
  readonly nameEn = signal('');
  readonly phone = signal('');
  readonly email = signal('');

  readonly canSubmit = computed(
    () =>
      !!this.nameAr().trim() &&
      !!this.phone().trim() &&
      !!this.email().trim() &&
      !this.facade.creating(),
  );

  readonly errorMessage = computed(() => {
    if (this.facade.createError() !== 'missing') return '';
    return this.locale.isRtl()
      ? 'أدخل الاسم والهاتف والبريد.'
      : 'Enter name, phone, and email.';
  });

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  close(): void {
    if (this.facade.creating()) return;
    this.facade.createError.set(null);
    this.closed.emit();
  }

  submit(): void {
    this.facade.createOfficer(
      {
        nameAr: this.nameAr(),
        nameEn: this.nameEn(),
        phone: this.phone(),
        email: this.email(),
      },
      (id) => this.created.emit(id),
    );
  }
}
