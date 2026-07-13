import { LocalizedText } from '../../overview/models/restaurant-overview.model';

export type MenuMealSlot =
  | 'breakfast'
  | 'main'
  | 'snack'
  | 'salad'
  | 'juice';

export type MenuMealStatus = 'active' | 'draft' | 'paused';

export type MenuFilter = 'all' | MenuMealStatus;

export type MenuSlotFilter = 'all' | MenuMealSlot;

export type MenuProgramFilter =
  | 'all'
  | 'fitness'
  | 'slim'
  | 'muscle'
  | 'balance';

export interface MenuSummary {
  id: string;
  label: LocalizedText;
  value: number;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
}

export interface MenuMealItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  slot: MenuMealSlot;
  slotLabel: LocalizedText;
  status: MenuMealStatus;
  programKey: Exclude<MenuProgramFilter, 'all'>;
  programLabel: LocalizedText;
  bundleLabel: LocalizedText;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  /** Restaurant meal price in KD (F24). Null = missing price. */
  priceKd: number | null;
  ingredientCount: number;
  allergyFlags: LocalizedText[];
  prepNote: LocalizedText;
  updatedAtLabel: LocalizedText;
  route?: string;
}

export interface MenuData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  ingredientsLinkLabel: LocalizedText;
  ingredientsRoute: string;
  summaries: MenuSummary[];
  meals: MenuMealItem[];
}
