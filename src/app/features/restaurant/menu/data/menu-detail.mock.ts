import { MenuMealItem } from '../models/menu.model';
import {
  MenuDetailData,
  MenuDetailIngredient,
} from '../models/menu-detail.model';
import { MENU_MOCK } from './menu.mock';

const INGREDIENT_PRESETS: Record<string, MenuDetailIngredient[]> = {
  'mn-1': [
    {
      id: 'i1',
      name: { ar: 'شوفان', en: 'Oats' },
      amount: { ar: '60 جم', en: '60 g' },
      weightGrams: 60,
      calories: 220,
      proteinGrams: 8,
    },
    {
      id: 'i2',
      name: { ar: 'حليب لوز', en: 'Almond milk' },
      amount: { ar: '180 مل', en: '180 ml' },
      weightGrams: 180,
      calories: 45,
      proteinGrams: 1,
      allergen: true,
    },
    {
      id: 'i3',
      name: { ar: 'توت مشكل', en: 'Mixed berries' },
      amount: { ar: '80 جم', en: '80 g' },
      weightGrams: 80,
      calories: 35,
      proteinGrams: 1,
    },
    {
      id: 'i4',
      name: { ar: 'واي بروتين', en: 'Whey protein' },
      amount: { ar: '25 جم', en: '25 g' },
      weightGrams: 25,
      calories: 95,
      proteinGrams: 20,
      allergen: true,
    },
  ],
  'mn-3': [
    {
      id: 'i1',
      name: { ar: 'صدر دجاج', en: 'Chicken breast' },
      amount: { ar: '160 جم', en: '160 g' },
      weightGrams: 160,
      calories: 265,
      proteinGrams: 48,
    },
    {
      id: 'i2',
      name: { ar: 'كينوا', en: 'Quinoa' },
      amount: { ar: '90 جم مطبوخ', en: '90 g cooked' },
      weightGrams: 90,
      calories: 110,
      proteinGrams: 4,
    },
    {
      id: 'i3',
      name: { ar: 'خضار سوتيه', en: 'Sautéed veggies' },
      amount: { ar: '120 جم', en: '120 g' },
      weightGrams: 120,
      calories: 45,
      proteinGrams: 2,
    },
  ],
};

function fallbackIngredients(meal: MenuMealItem): MenuDetailIngredient[] {
  const count = Math.max(meal.ingredientCount, 2);
  return Array.from({ length: Math.min(count, 6) }, (_, index) => ({
    id: `fi-${index + 1}`,
    name: {
      ar: `مكوّن ${index + 1}`,
      en: `Ingredient ${index + 1}`,
    },
    amount: {
      ar: `${40 + index * 15} جم`,
      en: `${40 + index * 15} g`,
    },
    weightGrams: 40 + index * 15,
    calories: Math.round(meal.calories / count),
    proteinGrams: Math.round(meal.proteinGrams / count),
    allergen: meal.allergyFlags.length > 0 && index === 0,
  }));
}

export function buildMenuDetail(meal: MenuMealItem): MenuDetailData {
  const ingredients =
    INGREDIENT_PRESETS[meal.id] ?? fallbackIngredients(meal);

  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    imageUrl: meal.imageUrl,
    status: meal.status,
    slot: meal.slot,
    slotLabel: meal.slotLabel,
    programKey: meal.programKey,
    programLabel: meal.programLabel,
    bundleLabel: meal.bundleLabel,
    calories: meal.calories,
    proteinGrams: meal.proteinGrams,
    carbsGrams: meal.carbsGrams,
    fatGrams: meal.fatGrams,
    fiberGrams: Math.max(2, Math.round(meal.carbsGrams * 0.15)),
    sugarGrams: Math.max(1, Math.round(meal.carbsGrams * 0.25)),
    sodiumMg: 180 + meal.proteinGrams * 4,
    servingWeightGrams: 280 + meal.ingredientCount * 12,
    allergyFlags: meal.allergyFlags,
    prepNote: meal.prepNote,
    kitchenNote: {
      ar: 'اتبع معايير النظافة والتعبئة · لا تُظهر بيانات العميل على الملصق',
      en: 'Follow hygiene and packing standards · never expose customer PII on labels',
    },
    updatedAtLabel: meal.updatedAtLabel,
    listRoute: '/restaurant/operations/menu',
    ingredientsRoute: '/restaurant/operations/ingredients',
    facts: [
      {
        id: 'slot',
        label: { ar: 'الفئة', en: 'Slot' },
        value: meal.slotLabel,
        icon: 'lucideUtensilsCrossed',
      },
      {
        id: 'program',
        label: { ar: 'البرنامج', en: 'Program' },
        value: meal.programLabel,
        icon: 'lucideDumbbell',
      },
      {
        id: 'bundle',
        label: { ar: 'الباقة', en: 'Bundle' },
        value: meal.bundleLabel,
        icon: 'lucidePackage',
      },
      {
        id: 'serving',
        label: { ar: 'حجم الحصة', en: 'Serving' },
        value: {
          ar: `${280 + meal.ingredientCount * 12} جم`,
          en: `${280 + meal.ingredientCount * 12} g`,
        },
        icon: 'lucideScale',
      },
      {
        id: 'ingredients',
        label: { ar: 'المكوّنات', en: 'Ingredients' },
        value: {
          ar: `${ingredients.length} مكوّن`,
          en: `${ingredients.length} items`,
        },
        icon: 'lucideCookingPot',
      },
      {
        id: 'updated',
        label: { ar: 'آخر تحديث', en: 'Updated' },
        value: meal.updatedAtLabel,
        icon: 'lucideClock3',
      },
    ],
    ingredients,
  };
}

export function getMenuDetailById(mealId: string): MenuDetailData | null {
  const meal = MENU_MOCK.meals.find((item) => item.id === mealId);
  if (!meal) return null;
  return buildMenuDetail(structuredClone(meal));
}

export function buildFallbackMenuDetail(mealId: string): MenuDetailData {
  const base = structuredClone(MENU_MOCK.meals[0]);
  return buildMenuDetail({
    ...base,
    id: mealId || 'mn-unknown',
    name: { ar: 'وجبة غير معروفة', en: 'Unknown meal' },
    description: {
      ar: 'تعذر العثور على الوجبة في الكتالوج',
      en: 'Meal was not found in the catalog',
    },
    status: 'draft',
  });
}
