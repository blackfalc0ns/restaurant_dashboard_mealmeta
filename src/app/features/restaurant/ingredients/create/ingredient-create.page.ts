import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCookingPot,
  lucidePlus,
  lucideSave,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import {
  INGREDIENT_CREATE_CATEGORIES,
  IngredientCreateFacade,
} from '../data/ingredient-create.facade';

@Component({
  selector: 'mm-ingredient-create-page',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIcon],
  templateUrl: './ingredient-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-igc-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCookingPot,
      lucidePlus,
      lucideSave,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class IngredientCreatePageComponent implements OnInit {
  readonly facade = inject(IngredientCreateFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = INGREDIENT_CREATE_CATEGORIES;

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للمكوّنات' : 'Back to ingredients',
  );

  readonly title = computed(() =>
    this.locale.isRtl() ? 'إنشاء مكوّن جديد' : 'Create new ingredient',
  );

  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'الاسم · الفئة · القيم الغذائية لكل 100 جم · الحساسية'
      : 'Name · category · nutrition per 100g · allergens',
  );

  readonly saveLabel = computed(() =>
    this.locale.isRtl() ? 'حفظ كمسودة' : 'Save as draft',
  );

  readonly addAllergenLabel = computed(() =>
    this.locale.isRtl() ? 'إضافة حساسية' : 'Add allergen',
  );

  readonly allergenErrorLabel = computed(() => {
    const error = this.facade.allergenError();
    if (error === 'incomplete') {
      return this.locale.isRtl()
        ? 'أدخل الاسم بالعربي والإنجليزي'
        : 'Enter both Arabic and English names';
    }
    if (error === 'duplicate') {
      return this.locale.isRtl()
        ? 'هذه الحساسية موجودة بالفعل'
        : 'This allergen already exists';
    }
    return '';
  });

  readonly previewName = computed(() => {
    const draft = this.facade.draft();
    const name = this.locale.isRtl() ? draft.nameAr : draft.nameEn;
    return (
      name.trim() ||
      (this.locale.isRtl() ? 'اسم المكوّن' : 'Ingredient name')
    );
  });

  readonly categoryPreview = computed(() => {
    const category = this.categories.find(
      (item) => item.id === this.facade.draft().category,
    );
    return category ? this.optionLabel(category) : '';
  });

  readonly allergenPreview = computed(() => {
    const keys = this.facade.draft().allergenKeys;
    return this.facade
      .allergenOptions()
      .filter((item) => keys.includes(item.id))
      .map((item) => this.optionLabel(item));
  });

  ngOnInit(): void {
    this.facade.reset();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  optionLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  onNumber(
    key:
      | 'defaultWeightGrams'
      | 'caloriesPer100g'
      | 'proteinPer100g'
      | 'carbsPer100g'
      | 'fatPer100g',
    value: string | number | null,
  ): void {
    if (value === '' || value === null) {
      this.facade.patch(key, null);
      return;
    }
    const parsed = Number(value);
    this.facade.patch(key, Number.isFinite(parsed) ? parsed : null);
  }

  addAllergen(): void {
    this.facade.addAllergen();
  }

  onNewAllergenAr(value: string): void {
    this.facade.newAllergenAr.set(value);
    this.facade.allergenError.set('');
  }

  onNewAllergenEn(value: string): void {
    this.facade.newAllergenEn.set(value);
    this.facade.allergenError.set('');
  }

  submit(): void {
    this.facade.submit();
  }
}
