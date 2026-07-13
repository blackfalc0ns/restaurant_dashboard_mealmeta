import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideImagePlus,
  lucideSave,
  lucideTrash2,
  lucideUpload,
  lucideUtensilsCrossed,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

import {
  MENU_CREATE_ALLERGENS,
  MENU_CREATE_BUNDLES,
  MENU_CREATE_IMAGES,
  MENU_CREATE_INGREDIENTS,
  MENU_CREATE_PORTIONS,
  MENU_CREATE_PREP_NOTES,
  MenuCreateFacade,
} from '../data/menu-create.facade';
import { MenuCreateProgram } from '../models/menu-create.model';
import { MenuMealSlot } from '../models/menu.model';
import {
  IngredientDropdownComponent,
  IngredientDropdownOptionView,
} from './ingredient-dropdown.component';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
]);

@Component({
  selector: 'mm-menu-create-page',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIcon, IngredientDropdownComponent],
  templateUrl: './menu-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mm-mnc-page flex h-full min-h-0 flex-col' },
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideImagePlus,
      lucideSave,
      lucideTrash2,
      lucideUpload,
      lucideUtensilsCrossed,
      lucideX,
    }),
  ],
})
export class MenuCreatePageComponent implements OnInit {
  readonly facade = inject(MenuCreateFacade);
  readonly locale = inject(AppLocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('imageInput');

  readonly allergens = MENU_CREATE_ALLERGENS;
  readonly images = MENU_CREATE_IMAGES;
  readonly bundles = MENU_CREATE_BUNDLES;
  readonly prepNotes = MENU_CREATE_PREP_NOTES;
  readonly portions = MENU_CREATE_PORTIONS;
  readonly catalog = MENU_CREATE_INGREDIENTS;
  readonly imageError = signal('');

  readonly dropdownOptions = computed<IngredientDropdownOptionView[]>(() => {
    const rtl = this.locale.isRtl();
    return this.catalog.map((option) => ({
      option,
      label: rtl ? option.labelAr : option.labelEn,
      nutrition: this.facade.catalogNutrition(option.id),
      selected: this.facade.isSelected(option.id),
      disabled: false,
    }));
  });

  readonly slots: Array<{ id: MenuMealSlot; labelAr: string; labelEn: string }> =
    [
      { id: 'breakfast', labelAr: 'إفطار', labelEn: 'Breakfast' },
      { id: 'main', labelAr: 'رئيسية', labelEn: 'Main' },
      { id: 'snack', labelAr: 'سناك', labelEn: 'Snack' },
      { id: 'salad', labelAr: 'سلطة', labelEn: 'Salad' },
      { id: 'juice', labelAr: 'عصير', labelEn: 'Juice' },
    ];

  readonly programs: Array<{
    id: MenuCreateProgram;
    labelAr: string;
    labelEn: string;
  }> = [
    { id: 'fitness', labelAr: 'لياقة', labelEn: 'Fitness' },
    { id: 'slim', labelAr: 'رشاقة', labelEn: 'Slim' },
    { id: 'muscle', labelAr: 'عضلات', labelEn: 'Muscle' },
    { id: 'balance', labelAr: 'توازن', labelEn: 'Balance' },
  ];

  readonly backLabel = computed(() =>
    this.locale.isRtl() ? 'العودة للقائمة' : 'Back to menu',
  );

  readonly title = computed(() =>
    this.locale.isRtl() ? 'إنشاء وجبة جديدة' : 'Create new meal',
  );

  readonly subtitle = computed(() =>
    this.locale.isRtl()
      ? 'ارفع صورة الوجبة · اختر المكوّنات · السعرات تُحسب تلقائيًا'
      : 'Upload meal image · pick ingredients · calories calculate automatically',
  );

  readonly saveLabel = computed(() =>
    this.locale.isRtl() ? 'حفظ كمسودة' : 'Save as draft',
  );

  readonly previewName = computed(() => {
    const draft = this.facade.draft();
    const name = this.locale.isRtl() ? draft.nameAr : draft.nameEn;
    return name.trim() || (this.locale.isRtl() ? 'اسم الوجبة' : 'Meal name');
  });

  readonly previewDescription = computed(() => {
    const draft = this.facade.draft();
    const text = this.locale.isRtl()
      ? draft.descriptionAr
      : draft.descriptionEn;
    return (
      text.trim() ||
      (this.locale.isRtl()
        ? 'الوصف سيظهر هنا بعد الإدخال'
        : 'Description appears here after you fill it')
    );
  });

  readonly previewImage = computed(
    () =>
      this.facade.draft().imageUrl ||
      'assets/images/meals/chicken-quinoa.jpg',
  );

  readonly slotPreview = computed(() => {
    const slot = this.slots.find((item) => item.id === this.facade.draft().slot);
    return slot ? this.optionLabel(slot) : '';
  });

  readonly programPreview = computed(() => {
    const program = this.programs.find(
      (item) => item.id === this.facade.draft().programKey,
    );
    return program ? this.optionLabel(program) : '';
  });

  readonly bundlePreview = computed(() => {
    const bundle = this.bundles.find(
      (item) => item.id === this.facade.draft().bundleId,
    );
    return bundle ? this.optionLabel(bundle) : '';
  });

  ngOnInit(): void {
    this.facade.reset();
    this.destroyRef.onDestroy(() => this.facade.reset());
  }

  optionLabel(option: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? option.labelAr : option.labelEn;
  }

  openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      this.imageError.set(
        this.locale.isRtl()
          ? 'الصيغة المسموحة: JPG أو PNG أو WEBP'
          : 'Allowed formats: JPG, PNG, or WEBP',
      );
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      this.imageError.set(
        this.locale.isRtl()
          ? 'الحد الأقصى لحجم الصورة 4MB'
          : 'Maximum image size is 4MB',
      );
      input.value = '';
      return;
    }

    this.imageError.set('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        this.imageError.set(
          this.locale.isRtl()
            ? 'تعذر قراءة الصورة'
            : 'Could not read the image',
        );
        return;
      }
      this.facade.setUploadedImage(result, file.name);
    };
    reader.onerror = () => {
      this.imageError.set(
        this.locale.isRtl() ? 'فشل رفع الصورة' : 'Image upload failed',
      );
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  clearUploadedImage(): void {
    this.imageError.set('');
    this.facade.clearImage();
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  selectGalleryImage(url: string): void {
    this.imageError.set('');
    this.facade.setGalleryImage(url);
  }

  onIngredientPicked(ingredientId: string): void {
    this.facade.addIngredientById(ingredientId);
  }

  submit(): void {
    this.facade.submit();
  }
}
