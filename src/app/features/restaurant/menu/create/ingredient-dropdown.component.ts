import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideSearch,
} from '@ng-icons/lucide';

import {
  MenuCreateIngredientOption,
  MenuCreateNutritionTotals,
} from '../models/menu-create.model';

export interface IngredientDropdownOptionView {
  option: MenuCreateIngredientOption;
  label: string;
  nutrition: MenuCreateNutritionTotals;
  selected: boolean;
  disabled: boolean;
}

@Component({
  selector: 'mm-ingredient-dropdown',
  standalone: true,
  imports: [FormsModule, NgIcon, CdkOverlayOrigin, CdkConnectedOverlay],
  templateUrl: './ingredient-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-ing-dd block' },
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronDown,
      lucideSearch,
    }),
  ],
})
export class IngredientDropdownComponent {
  readonly options = input.required<IngredientDropdownOptionView[]>();
  readonly placeholder = input('Select ingredient...');
  readonly searchPlaceholder = input('Search...');
  readonly emptyLabel = input('No results');
  readonly triggerLabel = input('Add ingredient');
  readonly isRtl = input(false);

  readonly picked = output<string>();

  readonly open = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(0);

  private readonly trigger =
    viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter((item) => {
      const hay = `${item.label} ${item.option.labelAr} ${item.option.labelEn}`.toLowerCase();
      return hay.includes(q);
    });
  });

  readonly selectable = computed(() =>
    this.filtered().filter((item) => !item.disabled && !item.selected),
  );

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.open.set(true);
    this.query.set('');
    this.activeIndex.set(0);
  }

  close(): void {
    this.open.set(false);
    this.query.set('');
    this.activeIndex.set(0);
  }

  select(item: IngredientDropdownOptionView): void {
    if (item.disabled || item.selected) return;
    this.picked.emit(item.option.id);
    this.close();
    queueMicrotask(() => this.trigger()?.nativeElement.focus());
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
      return;
    }

    const items = this.selectable();
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!items.length) return;
      this.activeIndex.set((this.activeIndex() + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!items.length) return;
      this.activeIndex.set(
        (this.activeIndex() - 1 + items.length) % items.length,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const item = items[this.activeIndex()];
      if (item) this.select(item);
    }
  }

  isActive(item: IngredientDropdownOptionView): boolean {
    const items = this.selectable();
    const current = items[this.activeIndex()];
    return current?.option.id === item.option.id;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }
}
