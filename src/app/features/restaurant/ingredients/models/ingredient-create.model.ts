import { IngredientCategory } from './ingredient.model';

export interface IngredientCreateDraft {
  nameAr: string;
  nameEn: string;
  category: IngredientCategory;
  defaultWeightGrams: number | null;
  caloriesPer100g: number | null;
  proteinPer100g: number | null;
  carbsPer100g: number | null;
  fatPer100g: number | null;
  allergenKeys: string[];
}

export interface IngredientCreateAllergenOption {
  id: string;
  labelAr: string;
  labelEn: string;
}

export interface IngredientCreateCategoryOption {
  id: IngredientCategory;
  labelAr: string;
  labelEn: string;
}
