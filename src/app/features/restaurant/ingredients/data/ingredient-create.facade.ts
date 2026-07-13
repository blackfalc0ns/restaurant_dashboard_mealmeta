import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  IngredientCreateAllergenOption,
  IngredientCreateCategoryOption,
  IngredientCreateDraft,
} from '../models/ingredient-create.model';
import { IngredientCategory, IngredientItem } from '../models/ingredient.model';
import { IngredientsFacade } from './ingredients.facade';

export const INGREDIENT_CREATE_CATEGORIES: IngredientCreateCategoryOption[] = [
  { id: 'poultry', labelAr: 'دواجن / لحوم', labelEn: 'Poultry / meat' },
  { id: 'seafood', labelAr: 'مأكولات بحرية', labelEn: 'Seafood' },
  { id: 'dairy', labelAr: 'ألبان وبيض', labelEn: 'Dairy & eggs' },
  { id: 'produce', labelAr: 'خضار وفواكه', labelEn: 'Produce' },
  { id: 'grains', labelAr: 'حبوب', labelEn: 'Grains' },
  { id: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

export const INGREDIENT_CREATE_ALLERGENS: IngredientCreateAllergenOption[] = [
  { id: 'dairy', labelAr: 'حليب', labelEn: 'Dairy' },
  { id: 'eggs', labelAr: 'بيض', labelEn: 'Eggs' },
  { id: 'nuts', labelAr: 'مكسرات', labelEn: 'Nuts' },
  { id: 'fish', labelAr: 'سمك', labelEn: 'Fish' },
  { id: 'gluten', labelAr: 'غلوتين', labelEn: 'Gluten' },
  { id: 'sesame', labelAr: 'سمسم', labelEn: 'Sesame' },
];

const CATEGORY_LABELS: Record<IngredientCategory, { ar: string; en: string }> =
  Object.fromEntries(
    INGREDIENT_CREATE_CATEGORIES.map((item) => [
      item.id,
      { ar: item.labelAr, en: item.labelEn },
    ]),
  ) as Record<IngredientCategory, { ar: string; en: string }>;

function createEmptyDraft(): IngredientCreateDraft {
  return {
    nameAr: '',
    nameEn: '',
    category: 'produce',
    defaultWeightGrams: 100,
    caloriesPer100g: null,
    proteinPer100g: null,
    carbsPer100g: null,
    fatPer100g: null,
    allergenKeys: [],
  };
}

function slugifyAllergenId(labelEn: string, labelAr: string): string {
  const base = (labelEn.trim() || labelAr.trim())
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  return `custom-${base || Date.now().toString(36)}`;
}

@Injectable({ providedIn: 'root' })
export class IngredientCreateFacade {
  private readonly router = inject(Router);
  private readonly ingredientsFacade = inject(IngredientsFacade);

  readonly draft = signal<IngredientCreateDraft>(createEmptyDraft());
  readonly customAllergens = signal<IngredientCreateAllergenOption[]>([]);
  readonly newAllergenAr = signal('');
  readonly newAllergenEn = signal('');
  readonly allergenError = signal('');
  readonly saving = signal(false);
  readonly submitted = signal(false);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly allergenOptions = computed(() => [
    ...INGREDIENT_CREATE_ALLERGENS,
    ...this.customAllergens(),
  ]);

  readonly canAddAllergen = computed(() => {
    const ar = this.newAllergenAr().trim();
    const en = this.newAllergenEn().trim();
    return ar.length > 0 && en.length > 0;
  });

  readonly canSubmit = computed(() => {
    const draft = this.draft();
    return (
      draft.nameAr.trim().length > 0 &&
      draft.nameEn.trim().length > 0 &&
      draft.defaultWeightGrams !== null &&
      draft.defaultWeightGrams > 0 &&
      draft.caloriesPer100g !== null &&
      draft.caloriesPer100g >= 0 &&
      draft.proteinPer100g !== null &&
      draft.proteinPer100g >= 0 &&
      draft.carbsPer100g !== null &&
      draft.carbsPer100g >= 0 &&
      draft.fatPer100g !== null &&
      draft.fatPer100g >= 0
    );
  });

  patch<K extends keyof IngredientCreateDraft>(
    key: K,
    value: IngredientCreateDraft[K],
  ): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  toggleAllergen(key: string): void {
    this.draft.update((current) => {
      const exists = current.allergenKeys.includes(key);
      return {
        ...current,
        allergenKeys: exists
          ? current.allergenKeys.filter((item) => item !== key)
          : [...current.allergenKeys, key],
      };
    });
  }

  isAllergenSelected(key: string): boolean {
    return this.draft().allergenKeys.includes(key);
  }

  isCustomAllergen(key: string): boolean {
    return this.customAllergens().some((item) => item.id === key);
  }

  addAllergen(): boolean {
    const labelAr = this.newAllergenAr().trim();
    const labelEn = this.newAllergenEn().trim();

    if (!labelAr || !labelEn) {
      this.allergenError.set('incomplete');
      return false;
    }

    const duplicate = this.allergenOptions().some(
      (option) =>
        option.labelAr.trim().toLowerCase() === labelAr.toLowerCase() ||
        option.labelEn.trim().toLowerCase() === labelEn.toLowerCase(),
    );

    if (duplicate) {
      this.allergenError.set('duplicate');
      return false;
    }

    let id = slugifyAllergenId(labelEn, labelAr);
    const existingIds = new Set(this.allergenOptions().map((item) => item.id));
    if (existingIds.has(id)) {
      id = `${id}-${Date.now().toString(36)}`;
    }

    const option: IngredientCreateAllergenOption = { id, labelAr, labelEn };
    this.customAllergens.update((list) => [...list, option]);
    this.draft.update((current) => ({
      ...current,
      allergenKeys: current.allergenKeys.includes(id)
        ? current.allergenKeys
        : [...current.allergenKeys, id],
    }));
    this.newAllergenAr.set('');
    this.newAllergenEn.set('');
    this.allergenError.set('');
    return true;
  }

  removeCustomAllergen(key: string): void {
    if (!this.isCustomAllergen(key)) return;

    this.customAllergens.update((list) =>
      list.filter((item) => item.id !== key),
    );
    this.draft.update((current) => ({
      ...current,
      allergenKeys: current.allergenKeys.filter((item) => item !== key),
    }));
  }

  submit(): void {
    if (!this.canSubmit() || this.saving()) return;

    this.saving.set(true);
    this.submitted.set(false);

    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      const item = this.toIngredientItem(this.draft());
      this.ingredientsFacade.prependIngredient(item);
      this.saving.set(false);
      this.submitted.set(true);
      this.saveTimer = null;
      void this.router.navigateByUrl('/restaurant/operations/ingredients');
    }, 650);
  }

  reset(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.draft.set(createEmptyDraft());
    this.customAllergens.set([]);
    this.newAllergenAr.set('');
    this.newAllergenEn.set('');
    this.allergenError.set('');
    this.saving.set(false);
    this.submitted.set(false);
  }

  private toIngredientItem(draft: IngredientCreateDraft): IngredientItem {
    const id = `ing-${Date.now().toString(36)}`;
    const allergenLabels = this.allergenOptions()
      .filter((option) => draft.allergenKeys.includes(option.id))
      .map((option) => ({ ar: option.labelAr, en: option.labelEn }));

    return {
      id,
      name: { ar: draft.nameAr.trim(), en: draft.nameEn.trim() },
      category: draft.category,
      categoryLabel: CATEGORY_LABELS[draft.category],
      status: 'draft',
      defaultWeightGrams: Math.round(draft.defaultWeightGrams ?? 100),
      caloriesPer100g: Math.round(draft.caloriesPer100g ?? 0),
      proteinPer100g: Number(draft.proteinPer100g ?? 0),
      carbsPer100g: Number(draft.carbsPer100g ?? 0),
      fatPer100g: Number(draft.fatPer100g ?? 0),
      allergenKeys: [...draft.allergenKeys],
      allergenLabels,
      mealUsageCount: 0,
      updatedAtLabel: { ar: 'أُنشئ الآن', en: 'Created just now' },
    };
  }
}
