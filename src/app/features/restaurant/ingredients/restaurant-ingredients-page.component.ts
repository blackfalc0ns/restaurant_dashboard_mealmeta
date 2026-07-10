import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBeef,
  lucideCheck,
  lucideCircleAlert,
  lucideCookingPot,
  lucideFish,
  lucideLeaf,
  lucideMilk,
  lucidePackageOpen,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideShieldCheck,
  lucideTrash2,
  lucideWheat,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

type IngredientCategory = 'meat' | 'poultry' | 'seafood' | 'dairy' | 'produce' | 'grains' | 'other';
type IngredientFilter = 'all' | IngredientCategory;

interface RestaurantIngredient {
  id: string;
  category: IngredientCategory;
  nameAr: string;
  nameEn: string;
  detailsAr: string;
  detailsEn: string;
  supplier: string;
  originAr: string;
  originEn: string;
  storageAr: string;
  storageEn: string;
  halalCertified: boolean;
  containsAllergens: boolean;
  active: boolean;
}

interface CategoryOption {
  id: IngredientFilter;
  labelAr: string;
  labelEn: string;
  icon: string;
}

const EMPTY_INGREDIENT: RestaurantIngredient = {
  id: '',
  category: 'meat',
  nameAr: '',
  nameEn: '',
  detailsAr: '',
  detailsEn: '',
  supplier: '',
  originAr: '',
  originEn: '',
  storageAr: '',
  storageEn: '',
  halalCertified: true,
  containsAllergens: false,
  active: true,
};

@Component({
  selector: 'mm-restaurant-ingredients-page',
  standalone: true,
  imports: [FormsModule, NgIcon],
  templateUrl: './restaurant-ingredients-page.component.html',
  styleUrl: './restaurant-ingredients-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBeef,
      lucideCheck,
      lucideCircleAlert,
      lucideCookingPot,
      lucideFish,
      lucideLeaf,
      lucideMilk,
      lucidePackageOpen,
      lucidePencil,
      lucidePlus,
      lucideSearch,
      lucideShieldCheck,
      lucideTrash2,
      lucideWheat,
      lucideX,
    }),
  ],
})
export class RestaurantIngredientsPageComponent {
  private readonly storageKey = 'mm-restaurant-ingredients';
  readonly locale = inject(AppLocaleService);
  readonly query = signal('');
  readonly selectedCategory = signal<IngredientFilter>('all');
  readonly editorOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly savedNotice = signal(false);
  readonly draft = signal<RestaurantIngredient>({ ...EMPTY_INGREDIENT });

  readonly categories: CategoryOption[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: 'lucideCookingPot' },
    { id: 'meat', labelAr: 'لحوم حمراء', labelEn: 'Red meat', icon: 'lucideBeef' },
    { id: 'poultry', labelAr: 'دواجن', labelEn: 'Poultry', icon: 'lucideCookingPot' },
    { id: 'seafood', labelAr: 'أسماك وبحريات', labelEn: 'Fish & seafood', icon: 'lucideFish' },
    { id: 'dairy', labelAr: 'ألبان', labelEn: 'Dairy', icon: 'lucideMilk' },
    { id: 'produce', labelAr: 'خضار وفاكهة', labelEn: 'Fresh produce', icon: 'lucideLeaf' },
    { id: 'grains', labelAr: 'حبوب ونشويات', labelEn: 'Grains', icon: 'lucideWheat' },
    { id: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: 'lucidePackageOpen' },
  ];

  readonly ingredients = signal<RestaurantIngredient[]>([
    {
      id: 'ing-beef', category: 'meat', nameAr: 'لحم بقري', nameEn: 'Beef',
      detailsAr: 'تندرلوين وستريب لوين — مبرد طازج', detailsEn: 'Tenderloin & striploin — fresh chilled',
      supplier: 'Angus Premium', originAr: 'أستراليا', originEn: 'Australia',
      storageAr: 'تبريد 0–4°م', storageEn: 'Chilled 0–4°C', halalCertified: true,
      containsAllergens: false, active: true,
    },
    {
      id: 'ing-chicken', category: 'poultry', nameAr: 'صدور دجاج', nameEn: 'Chicken breast',
      detailsAr: 'طازج بدون جلد أو عظم', detailsEn: 'Fresh, skinless & boneless',
      supplier: 'Al Wataniya Fresh', originAr: 'السعودية', originEn: 'Saudi Arabia',
      storageAr: 'تبريد 0–2°م', storageEn: 'Chilled 0–2°C', halalCertified: true,
      containsAllergens: false, active: true,
    },
    {
      id: 'ing-salmon', category: 'seafood', nameAr: 'سلمون', nameEn: 'Salmon',
      detailsAr: 'فيليه سلمون طازج', detailsEn: 'Fresh salmon fillet',
      supplier: 'North Sea Foods', originAr: 'النرويج', originEn: 'Norway',
      storageAr: 'على الثلج 0–1°م', storageEn: 'On ice 0–1°C', halalCertified: true,
      containsAllergens: true, active: true,
    },
    {
      id: 'ing-cheese', category: 'dairy', nameAr: 'موزاريلا قليلة الدسم', nameEn: 'Low-fat mozzarella',
      detailsAr: 'مبشورة ومناسبة لبرامج الدايت', detailsEn: 'Shredded, suitable for diet programs',
      supplier: 'Arla', originAr: 'هولندا', originEn: 'Netherlands',
      storageAr: 'تبريد 2–4°م', storageEn: 'Chilled 2–4°C', halalCertified: true,
      containsAllergens: true, active: true,
    },
    {
      id: 'ing-oil', category: 'other', nameAr: 'زيت زيتون بكر', nameEn: 'Extra virgin olive oil',
      detailsAr: 'عصرة أولى على البارد', detailsEn: 'First cold pressed',
      supplier: 'Monini', originAr: 'إيطاليا', originEn: 'Italy',
      storageAr: 'مكان جاف 15–20°م', storageEn: 'Dry storage 15–20°C', halalCertified: true,
      containsAllergens: false, active: true,
    },
  ]);

  readonly filteredIngredients = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    const category = this.selectedCategory();
    return this.ingredients().filter((ingredient) => {
      const matchesCategory = category === 'all' || ingredient.category === category;
      const content = [
        ingredient.nameAr, ingredient.nameEn, ingredient.detailsAr, ingredient.detailsEn,
        ingredient.supplier, ingredient.originAr, ingredient.originEn,
      ].join(' ').toLocaleLowerCase();
      return matchesCategory && (!query || content.includes(query));
    });
  });

  readonly activeCount = computed(() => this.ingredients().filter((item) => item.active).length);
  readonly certifiedCount = computed(() => this.ingredients().filter((item) => item.halalCertified).length);
  readonly allergenCount = computed(() => this.ingredients().filter((item) => item.containsAllergens).length);
  readonly formValid = computed(() => {
    const item = this.draft();
    return !!(item.nameAr.trim() && item.nameEn.trim() && item.detailsAr.trim() && item.supplier.trim());
  });

  constructor() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) this.ingredients.set(JSON.parse(saved) as RestaurantIngredient[]);
    } catch {
      // Keep the built-in starter data when storage is unavailable or invalid.
    }
  }

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  categoryLabel(category: IngredientCategory): string {
    const option = this.categories.find((item) => item.id === category);
    return option ? this.text(option.labelAr, option.labelEn) : category;
  }

  categoryIcon(category: IngredientCategory): string {
    return this.categories.find((item) => item.id === category)?.icon ?? 'lucidePackageOpen';
  }

  countForCategory(category: IngredientFilter): number {
    return category === 'all'
      ? this.ingredients().length
      : this.ingredients().filter((item) => item.category === category).length;
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  openCreate(): void {
    this.editingId.set(null);
    this.draft.set({ ...EMPTY_INGREDIENT });
    this.submitted.set(false);
    this.editorOpen.set(true);
  }

  openEdit(item: RestaurantIngredient): void {
    this.editingId.set(item.id);
    this.draft.set({ ...item });
    this.submitted.set(false);
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.submitted.set(false);
  }

  updateDraft<K extends keyof RestaurantIngredient>(key: K, value: RestaurantIngredient[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  save(): void {
    this.submitted.set(true);
    if (!this.formValid()) return;

    const editingId = this.editingId();
    const item = { ...this.draft(), id: editingId ?? `ing-${Date.now()}` };
    this.ingredients.update((items) =>
      editingId ? items.map((current) => current.id === editingId ? item : current) : [item, ...items],
    );
    this.persist();
    this.closeEditor();
    this.savedNotice.set(true);
    window.setTimeout(() => this.savedNotice.set(false), 2600);
  }

  remove(item: RestaurantIngredient): void {
    const confirmed = window.confirm(
      this.text(`هل تريد حذف «${item.nameAr}»؟`, `Delete “${item.nameEn}”?`),
    );
    if (confirmed) {
      this.ingredients.update((items) => items.filter((current) => current.id !== item.id));
      this.persist();
    }
  }

  toggleActive(item: RestaurantIngredient): void {
    this.ingredients.update((items) =>
      items.map((current) => current.id === item.id ? { ...current, active: !current.active } : current),
    );
    this.persist();
  }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.ingredients()));
    } catch {
      // The page remains usable when storage is unavailable.
    }
  }
}
