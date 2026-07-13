import { LocalizedText } from '../../overview/models/restaurant-overview.model';
import { MenuMealItem, MenuMealStatus } from './menu.model';

export interface MenuDetailFact {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  icon: string;
}

export interface MenuDetailIngredient {
  id: string;
  name: LocalizedText;
  amount: LocalizedText;
  weightGrams: number;
  calories: number;
  proteinGrams: number;
  allergen?: boolean;
}

export interface MenuDetailData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  status: MenuMealStatus;
  slot: MenuMealItem['slot'];
  slotLabel: LocalizedText;
  programKey: MenuMealItem['programKey'];
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  sodiumMg: number;
  servingWeightGrams: number;
  allergyFlags: LocalizedText[];
  prepNote: LocalizedText;
  kitchenNote: LocalizedText;
  updatedAtLabel: LocalizedText;
  listRoute: string;
  ingredientsRoute: string;
  facts: MenuDetailFact[];
  ingredients: MenuDetailIngredient[];
}
