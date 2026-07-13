import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  MenuCreateAllergenOption,
  MenuCreateBundleOption,
  MenuCreateDraft,
  MenuCreateImageOption,
  MenuCreateIngredientOption,
  MenuCreateNutritionTotals,
  MenuCreatePortionOption,
  MenuCreatePrepOption,
  MenuCreateProgram,
} from '../models/menu-create.model';
import { MenuMealItem, MenuMealSlot } from '../models/menu.model';
import { MenuFacade } from './menu.facade';

const SLOT_LABELS: Record<MenuMealSlot, { ar: string; en: string }> = {
  breakfast: { ar: 'إفطار', en: 'Breakfast' },
  main: { ar: 'رئيسية', en: 'Main' },
  snack: { ar: 'سناك', en: 'Snack' },
  salad: { ar: 'سلطة', en: 'Salad' },
  juice: { ar: 'عصير', en: 'Juice' },
};

const PROGRAM_LABELS: Record<MenuCreateProgram, { ar: string; en: string }> = {
  fitness: { ar: 'لياقة', en: 'Fitness' },
  slim: { ar: 'رشاقة', en: 'Slim' },
  muscle: { ar: 'عضلات', en: 'Muscle' },
  balance: { ar: 'توازن', en: 'Balance' },
};

export const MENU_CREATE_ALLERGENS: MenuCreateAllergenOption[] = [
  { id: 'dairy', labelAr: 'حليب', labelEn: 'Dairy' },
  { id: 'eggs', labelAr: 'بيض', labelEn: 'Eggs' },
  { id: 'nuts', labelAr: 'مكسرات', labelEn: 'Nuts' },
  { id: 'fish', labelAr: 'سمك', labelEn: 'Fish' },
  { id: 'gluten', labelAr: 'غلوتين', labelEn: 'Gluten' },
  { id: 'sesame', labelAr: 'سمسم', labelEn: 'Sesame' },
];

export const MENU_CREATE_IMAGES: MenuCreateImageOption[] = [
  {
    id: 'protein-oats',
    labelAr: 'شوفان',
    labelEn: 'Oats',
    url: 'assets/images/meals/protein-oats.jpg',
  },
  {
    id: 'omelette',
    labelAr: 'أومليت',
    labelEn: 'Omelette',
    url: 'assets/images/meals/omelette.jpg',
  },
  {
    id: 'chicken-quinoa',
    labelAr: 'دجاج وكينوا',
    labelEn: 'Chicken quinoa',
    url: 'assets/images/meals/chicken-quinoa.jpg',
  },
  {
    id: 'salmon',
    labelAr: 'سلمون',
    labelEn: 'Salmon',
    url: 'assets/images/meals/salmon.jpg',
  },
  {
    id: 'quinoa-salad',
    labelAr: 'سلطة كينوا',
    labelEn: 'Quinoa salad',
    url: 'assets/images/meals/quinoa-salad.jpg',
  },
  {
    id: 'yogurt-berries',
    labelAr: 'زبادي وتوت',
    labelEn: 'Yogurt berries',
    url: 'assets/images/meals/yogurt-berries.jpg',
  },
  {
    id: 'steak-broccoli',
    labelAr: 'ستيك وبروكلي',
    labelEn: 'Steak broccoli',
    url: 'assets/images/meals/steak-broccoli.jpg',
  },
  {
    id: 'chicken-tikka',
    labelAr: 'دجاج تكا',
    labelEn: 'Chicken tikka',
    url: 'assets/images/meals/chicken-tikka.jpg',
  },
];

export const MENU_CREATE_BUNDLES: MenuCreateBundleOption[] = [
  { id: 'full', labelAr: 'باقة كاملة', labelEn: 'Full package' },
  { id: 'full-lunch', labelAr: 'كاملة / غداء', labelEn: 'Full / Lunch' },
  { id: 'full-dinner', labelAr: 'كاملة / عشاء', labelEn: 'Full / Dinner' },
  { id: 'light', labelAr: 'باقة خفيفة', labelEn: 'Light package' },
];

export const MENU_CREATE_PREP_NOTES: MenuCreatePrepOption[] = [
  {
    id: 'chill-night',
    labelAr: 'يُقدَّم باردًا · يُحضَّر ليلة التسليم',
    labelEn: 'Serve chilled · prep night before delivery',
  },
  {
    id: 'cook-morning',
    labelAr: 'يُطهى طازجًا صباح التسليم',
    labelEn: 'Cook fresh on delivery morning',
  },
  {
    id: 'temp-74',
    labelAr: 'درجة داخلية 74°م · يُبرَّد سريعًا',
    labelEn: 'Internal 74°C · rapid chill',
  },
  {
    id: 'marinate-4h',
    labelAr: 'تتبيل 4 ساعات على الأقل',
    labelEn: 'Marinate at least 4 hours',
  },
  {
    id: 'keep-chilled',
    labelAr: 'يُبرَّد حتى التسليم',
    labelEn: 'Keep chilled until handover',
  },
  {
    id: 'dress-1h',
    labelAr: 'يُتبل قبل التسليم بساعة',
    labelEn: 'Dress 1 hour before delivery',
  },
];

export const MENU_CREATE_PORTIONS: MenuCreatePortionOption[] = [
  { id: 'light', labelAr: 'خفيف (½)', labelEn: 'Light (½)', multiplier: 0.5 },
  {
    id: 'standard',
    labelAr: 'قياسي (1×)',
    labelEn: 'Standard (1×)',
    multiplier: 1,
  },
  { id: 'large', labelAr: 'كبير (1½)', labelEn: 'Large (1½)', multiplier: 1.5 },
  { id: 'xl', labelAr: 'XL (2×)', labelEn: 'XL (2×)', multiplier: 2 },
];

export const MENU_CREATE_INGREDIENTS: MenuCreateIngredientOption[] = [
  {
    id: 'oats',
    labelAr: 'شوفان',
    labelEn: 'Oats',
    defaultWeightGrams: 60,
    caloriesPer100g: 370,
    proteinPer100g: 13,
    carbsPer100g: 60,
    fatPer100g: 7,
    allergen: true,
    allergenKey: 'gluten',
  },
  {
    id: 'almond-milk',
    labelAr: 'حليب لوز',
    labelEn: 'Almond milk',
    defaultWeightGrams: 180,
    caloriesPer100g: 25,
    proteinPer100g: 0.6,
    carbsPer100g: 1,
    fatPer100g: 2,
    allergen: true,
    allergenKey: 'nuts',
  },
  {
    id: 'berries',
    labelAr: 'توت مشكل',
    labelEn: 'Mixed berries',
    defaultWeightGrams: 80,
    caloriesPer100g: 45,
    proteinPer100g: 1,
    carbsPer100g: 10,
    fatPer100g: 0.3,
  },
  {
    id: 'whey',
    labelAr: 'واي بروتين',
    labelEn: 'Whey protein',
    defaultWeightGrams: 25,
    caloriesPer100g: 380,
    proteinPer100g: 80,
    carbsPer100g: 6,
    fatPer100g: 4,
    allergen: true,
    allergenKey: 'dairy',
  },
  {
    id: 'eggs',
    labelAr: 'بيض',
    labelEn: 'Eggs',
    defaultWeightGrams: 100,
    caloriesPer100g: 143,
    proteinPer100g: 13,
    carbsPer100g: 1,
    fatPer100g: 10,
    allergen: true,
    allergenKey: 'eggs',
  },
  {
    id: 'spinach',
    labelAr: 'سبانخ',
    labelEn: 'Spinach',
    defaultWeightGrams: 60,
    caloriesPer100g: 23,
    proteinPer100g: 3,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
  },
  {
    id: 'chicken-breast',
    labelAr: 'صدر دجاج',
    labelEn: 'Chicken breast',
    defaultWeightGrams: 160,
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
  },
  {
    id: 'quinoa',
    labelAr: 'كينوا مطبوخة',
    labelEn: 'Cooked quinoa',
    defaultWeightGrams: 90,
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21,
    fatPer100g: 1.9,
  },
  {
    id: 'broccoli',
    labelAr: 'بروكلي',
    labelEn: 'Broccoli',
    defaultWeightGrams: 120,
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
  },
  {
    id: 'salmon',
    labelAr: 'سلمون',
    labelEn: 'Salmon',
    defaultWeightGrams: 140,
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    allergen: true,
    allergenKey: 'fish',
  },
  {
    id: 'brown-rice',
    labelAr: 'أرز بني',
    labelEn: 'Brown rice',
    defaultWeightGrams: 100,
    caloriesPer100g: 112,
    proteinPer100g: 2.3,
    carbsPer100g: 24,
    fatPer100g: 0.8,
  },
  {
    id: 'lean-beef',
    labelAr: 'لحم قليل الدهن',
    labelEn: 'Lean beef',
    defaultWeightGrams: 140,
    caloriesPer100g: 180,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatPer100g: 8,
  },
  {
    id: 'greek-yogurt',
    labelAr: 'زبادي يوناني',
    labelEn: 'Greek yogurt',
    defaultWeightGrams: 150,
    caloriesPer100g: 97,
    proteinPer100g: 9,
    carbsPer100g: 4,
    fatPer100g: 5,
    allergen: true,
    allergenKey: 'dairy',
  },
  {
    id: 'lettuce',
    labelAr: 'خس',
    labelEn: 'Lettuce',
    defaultWeightGrams: 80,
    caloriesPer100g: 15,
    proteinPer100g: 1.4,
    carbsPer100g: 2.9,
    fatPer100g: 0.2,
  },
  {
    id: 'cucumber',
    labelAr: 'خيار',
    labelEn: 'Cucumber',
    defaultWeightGrams: 70,
    caloriesPer100g: 16,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatPer100g: 0.1,
  },
  {
    id: 'tomato',
    labelAr: 'طماطم',
    labelEn: 'Tomato',
    defaultWeightGrams: 60,
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
  },
];

function ingredientById(id: string): MenuCreateIngredientOption | undefined {
  return MENU_CREATE_INGREDIENTS.find((item) => item.id === id);
}

function portionById(id: string): MenuCreatePortionOption {
  return (
    MENU_CREATE_PORTIONS.find((item) => item.id === id) ??
    MENU_CREATE_PORTIONS[1]
  );
}

function createEmptyDraft(): MenuCreateDraft {
  return {
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    imageUrl: '',
    imageName: '',
    imageSource: 'upload',
    slot: 'main',
    programKey: 'fitness',
    bundleId: 'full',
    prepId: 'cook-morning',
    allergenKeys: [],
    ingredients: [],
  };
}

function calcRowNutrition(
  ingredientId: string,
  portionId: string,
): MenuCreateNutritionTotals {
  const ingredient = ingredientById(ingredientId);
  if (!ingredient) {
    return { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 };
  }
  const portion = portionById(portionId);
  const grams = ingredient.defaultWeightGrams * portion.multiplier;
  const factor = grams / 100;
  return {
    calories: Math.round(ingredient.caloriesPer100g * factor),
    proteinGrams: Math.round(ingredient.proteinPer100g * factor * 10) / 10,
    carbsGrams: Math.round(ingredient.carbsPer100g * factor * 10) / 10,
    fatGrams: Math.round(ingredient.fatPer100g * factor * 10) / 10,
  };
}

@Injectable({ providedIn: 'root' })
export class MenuCreateFacade {
  private readonly menuFacade = inject(MenuFacade);
  private readonly router = inject(Router);

  readonly draft = signal<MenuCreateDraft>(createEmptyDraft());
  readonly saving = signal(false);
  readonly submitted = signal(false);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private rowSeq = 1;

  readonly nutrition = computed<MenuCreateNutritionTotals>(() => {
    return this.draft().ingredients.reduce(
      (acc, row) => {
        if (!row.ingredientId) return acc;
        const part = calcRowNutrition(row.ingredientId, row.portionId);
        return {
          calories: acc.calories + part.calories,
          proteinGrams:
            Math.round((acc.proteinGrams + part.proteinGrams) * 10) / 10,
          carbsGrams: Math.round((acc.carbsGrams + part.carbsGrams) * 10) / 10,
          fatGrams: Math.round((acc.fatGrams + part.fatGrams) * 10) / 10,
        };
      },
      { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 },
    );
  });

  readonly selectedIngredientCount = computed(
    () => this.draft().ingredients.filter((row) => row.ingredientId).length,
  );

  readonly selectedIngredientIds = computed(
    () =>
      new Set(
        this.draft()
          .ingredients.map((row) => row.ingredientId)
          .filter(Boolean),
      ),
  );

  readonly canSubmit = computed(() => {
    const draft = this.draft();
    return (
      draft.nameAr.trim().length >= 2 &&
      draft.nameEn.trim().length >= 2 &&
      draft.descriptionAr.trim().length >= 4 &&
      draft.descriptionEn.trim().length >= 4 &&
      draft.imageUrl.trim().length > 0 &&
      this.selectedIngredientCount() >= 1 &&
      this.nutrition().calories > 0
    );
  });

  patch<K extends keyof MenuCreateDraft>(
    key: K,
    value: MenuCreateDraft[K],
  ): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  setGalleryImage(url: string): void {
    this.draft.update((current) => ({
      ...current,
      imageUrl: url,
      imageName: '',
      imageSource: 'gallery',
    }));
  }

  setUploadedImage(dataUrl: string, fileName: string): void {
    this.draft.update((current) => ({
      ...current,
      imageUrl: dataUrl,
      imageName: fileName,
      imageSource: 'upload',
    }));
  }

  clearImage(): void {
    this.draft.update((current) => ({
      ...current,
      imageUrl: '',
      imageName: '',
      imageSource: 'upload',
    }));
  }

  toggleAllergen(id: string): void {
    this.draft.update((current) => {
      const exists = current.allergenKeys.includes(id);
      return {
        ...current,
        allergenKeys: exists
          ? current.allergenKeys.filter((key) => key !== id)
          : [...current.allergenKeys, id],
      };
    });
  }

  toggleCatalogIngredient(ingredientId: string): void {
    const exists = this.draft().ingredients.some(
      (row) => row.ingredientId === ingredientId,
    );
    if (exists) {
      this.draft.update((current) => ({
        ...current,
        ingredients: current.ingredients.filter(
          (row) => row.ingredientId !== ingredientId,
        ),
      }));
    } else {
      this.addIngredientById(ingredientId);
      return;
    }
    this.syncAllergensFromIngredients();
  }

  addIngredientById(ingredientId: string): void {
    if (!ingredientId || this.isSelected(ingredientId)) return;
    this.rowSeq += 1;
    this.draft.update((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          rowId: `row-${Date.now().toString(36)}-${this.rowSeq}`,
          ingredientId,
          portionId: 'standard',
        },
      ],
    }));
    this.syncAllergensFromIngredients();
  }

  removeIngredient(rowId: string): void {
    this.draft.update((current) => ({
      ...current,
      ingredients: current.ingredients.filter((item) => item.rowId !== rowId),
    }));
    this.syncAllergensFromIngredients();
  }

  setPortion(rowId: string, portionId: string): void {
    this.draft.update((current) => ({
      ...current,
      ingredients: current.ingredients.map((item) =>
        item.rowId === rowId ? { ...item, portionId } : item,
      ),
    }));
  }

  isSelected(ingredientId: string): boolean {
    return this.selectedIngredientIds().has(ingredientId);
  }

  ingredientLabel(ingredientId: string, rtl: boolean): string {
    const item = ingredientById(ingredientId);
    if (!item) return rtl ? 'مكوّن' : 'Ingredient';
    return rtl ? item.labelAr : item.labelEn;
  }

  portionLabel(portionId: string, rtl: boolean): string {
    const item = portionById(portionId);
    return rtl ? item.labelAr : item.labelEn;
  }

  rowWeight(ingredientId: string, portionId: string): number {
    const ingredient = ingredientById(ingredientId);
    if (!ingredient) return 0;
    return Math.round(
      ingredient.defaultWeightGrams * portionById(portionId).multiplier,
    );
  }

  rowNutrition(
    ingredientId: string,
    portionId: string,
  ): MenuCreateNutritionTotals {
    return calcRowNutrition(ingredientId, portionId);
  }

  catalogNutrition(ingredientId: string): MenuCreateNutritionTotals {
    return calcRowNutrition(ingredientId, 'standard');
  }

  submit(): void {
    if (!this.canSubmit() || this.saving()) return;

    this.saving.set(true);
    this.submitted.set(false);

    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      const meal = this.toMealItem(this.draft());
      this.menuFacade.prependMeal(meal);
      this.saving.set(false);
      this.submitted.set(true);
      this.saveTimer = null;
      void this.router.navigateByUrl(`/restaurant/operations/menu/${meal.id}`);
    }, 700);
  }

  reset(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.rowSeq = 1;
    this.draft.set(createEmptyDraft());
    this.saving.set(false);
    this.submitted.set(false);
  }

  private syncAllergensFromIngredients(): void {
    const keys = Array.from(
      new Set(
        this.draft()
          .ingredients.map(
            (row) => ingredientById(row.ingredientId)?.allergenKey,
          )
          .filter((key): key is string => Boolean(key)),
      ),
    );

    this.draft.update((current) => ({
      ...current,
      allergenKeys: keys,
    }));
  }

  private toMealItem(draft: MenuCreateDraft): MenuMealItem {
    const allergens = MENU_CREATE_ALLERGENS.filter((option) =>
      draft.allergenKeys.includes(option.id),
    ).map((option) => ({ ar: option.labelAr, en: option.labelEn }));

    const filledIngredients = draft.ingredients.filter(
      (item) => item.ingredientId.trim(),
    );
    const nutrition = this.nutrition();
    const bundle =
      MENU_CREATE_BUNDLES.find((item) => item.id === draft.bundleId) ??
      MENU_CREATE_BUNDLES[0];
    const prep =
      MENU_CREATE_PREP_NOTES.find((item) => item.id === draft.prepId) ??
      MENU_CREATE_PREP_NOTES[0];

    const id = `mn-${Date.now().toString(36)}`;

    return {
      id,
      name: { ar: draft.nameAr.trim(), en: draft.nameEn.trim() },
      description: {
        ar: draft.descriptionAr.trim(),
        en: draft.descriptionEn.trim(),
      },
      imageUrl: draft.imageUrl || MENU_CREATE_IMAGES[0].url,
      slot: draft.slot,
      slotLabel: SLOT_LABELS[draft.slot],
      status: 'draft',
      programKey: draft.programKey,
      programLabel: PROGRAM_LABELS[draft.programKey],
      bundleLabel: { ar: bundle.labelAr, en: bundle.labelEn },
      calories: Math.round(nutrition.calories),
      proteinGrams: Math.round(nutrition.proteinGrams),
      carbsGrams: Math.round(nutrition.carbsGrams),
      fatGrams: Math.round(nutrition.fatGrams),
      priceKd: null,
      ingredientCount: Math.max(filledIngredients.length, 1),
      allergyFlags: allergens,
      prepNote: { ar: prep.labelAr, en: prep.labelEn },
      updatedAtLabel: { ar: 'أُنشئ الآن', en: 'Created just now' },
      route: `/restaurant/operations/menu/${id}`,
    };
  }
}
