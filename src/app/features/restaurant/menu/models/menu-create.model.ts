import {
  MenuMealSlot,
  MenuProgramFilter,
} from './menu.model';

export type MenuCreateProgram = Exclude<MenuProgramFilter, 'all'>;

export interface MenuCreateIngredientOption {
  id: string;
  labelAr: string;
  labelEn: string;
  defaultWeightGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  allergen?: boolean;
  allergenKey?: string;
}

export interface MenuCreatePortionOption {
  id: string;
  labelAr: string;
  labelEn: string;
  /** Multiplier against the ingredient default weight */
  multiplier: number;
}

export interface MenuCreateIngredientDraft {
  rowId: string;
  ingredientId: string;
  portionId: string;
}

export interface MenuCreateBundleOption {
  id: string;
  labelAr: string;
  labelEn: string;
}

export interface MenuCreatePrepOption {
  id: string;
  labelAr: string;
  labelEn: string;
}

export interface MenuCreateDraft {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  imageName: string;
  imageSource: 'upload' | 'gallery';
  slot: MenuMealSlot;
  programKey: MenuCreateProgram;
  bundleId: string;
  prepId: string;
  allergenKeys: string[];
  ingredients: MenuCreateIngredientDraft[];
}

export interface MenuCreateAllergenOption {
  id: string;
  labelAr: string;
  labelEn: string;
}

export interface MenuCreateImageOption {
  id: string;
  labelAr: string;
  labelEn: string;
  url: string;
}

export interface MenuCreateNutritionTotals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}
