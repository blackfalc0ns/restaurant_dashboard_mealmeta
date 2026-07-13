import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type IngredientStatus = 'active' | 'draft' | 'paused';

export type IngredientFilter = 'all' | IngredientStatus;

export type IngredientCategory =
  | 'poultry'
  | 'seafood'
  | 'dairy'
  | 'produce'
  | 'grains'
  | 'other';

export type IngredientCategoryFilter = 'all' | IngredientCategory;

export interface IngredientSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface IngredientItem {
  id: string;
  name: LocalizedText;
  category: IngredientCategory;
  categoryLabel: LocalizedText;
  status: IngredientStatus;
  defaultWeightGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  allergenKeys: string[];
  allergenLabels: LocalizedText[];
  mealUsageCount: number;
  updatedAtLabel: LocalizedText;
}

export interface IngredientCatalogData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  menuLinkLabel: LocalizedText;
  menuRoute: string;
  summaries: IngredientSummary[];
  ingredients: IngredientItem[];
}
