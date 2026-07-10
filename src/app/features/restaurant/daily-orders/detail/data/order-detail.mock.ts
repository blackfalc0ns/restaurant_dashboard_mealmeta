import {
  BoxMealItem,
  OrderDetailData,
} from '../models/order-detail.model';

const privacyNote = {
  ar: 'لا تُعرض بيانات العميل الشخصية. يظهر المعرّف المقنّع فقط وفق قواعد الخصوصية.',
  en: 'Customer personal data is hidden. Only the masked ID is shown per privacy rules.',
};

const fullComposition = {
  ar: 'إفطار + 2 وجبة رئيسية + سناك + سلطة',
  en: 'Breakfast + 2 mains + snack + salad',
};

const lunchComposition = {
  ar: 'وجبة رئيسية + سلطة',
  en: 'Main meal + salad',
};

function fullSlotSummary(): OrderDetailData['slotSummary'] {
  return [
    {
      slot: 'breakfast',
      label: { ar: 'إفطار', en: 'Breakfast' },
      expected: 1,
      filled: 1,
    },
    {
      slot: 'main',
      label: { ar: 'رئيسية', en: 'Mains' },
      expected: 2,
      filled: 2,
    },
    {
      slot: 'snack',
      label: { ar: 'سناك', en: 'Snack' },
      expected: 1,
      filled: 1,
    },
    {
      slot: 'salad',
      label: { ar: 'سلطة', en: 'Salad' },
      expected: 1,
      filled: 1,
    },
  ];
}

function lunchSlotSummary(): OrderDetailData['slotSummary'] {
  return [
    {
      slot: 'main',
      label: { ar: 'رئيسية', en: 'Main' },
      expected: 1,
      filled: 1,
    },
    {
      slot: 'salad',
      label: { ar: 'سلطة', en: 'Salad' },
      expected: 1,
      filled: 1,
    },
  ];
}

const fullBoxMealsOrd2418: BoxMealItem[] = [
  {
    id: 'bf-1',
    slot: 'breakfast',
    slotLabel: { ar: 'إفطار', en: 'Breakfast' },
    slotIndex: 1,
    name: { ar: 'أومليت بياض بيض بالسبانخ', en: 'Egg-white spinach omelette' },
    description: {
      ar: 'إفطار عالي البروتين ضمن برنامج اللياقة',
      en: 'High-protein breakfast for the Fitness program',
    },
    calories: 320,
    proteinGrams: 28,
    ingredients: [
      { id: 'i1', name: { ar: 'بياض بيض', en: 'Egg whites' }, amount: { ar: '120 جم', en: '120 g' } },
      { id: 'i2', name: { ar: 'سبانخ طازج', en: 'Fresh spinach' }, amount: { ar: '40 جم', en: '40 g' } },
      { id: 'i3', name: { ar: 'جبنة قليلة الدسم', en: 'Low-fat cheese' }, amount: { ar: '20 جم', en: '20 g' }, allergen: true },
      { id: 'i4', name: { ar: 'زيت زيتون', en: 'Olive oil' }, amount: { ar: '5 مل', en: '5 ml' } },
    ],
    allergyFlags: [{ ar: 'ألبان', en: 'Dairy' }],
    prepNote: { ar: 'يُقدَّم دافئًا · بدون ملح زائد', en: 'Serve warm · no extra salt' },
  },
  {
    id: 'mn-1',
    slot: 'main',
    slotLabel: { ar: 'وجبة رئيسية 1', en: 'Main meal 1' },
    slotIndex: 1,
    name: { ar: 'صدر دجاج مشوي + كينوا', en: 'Grilled chicken + quinoa' },
    description: {
      ar: 'الوجبة الرئيسية الأولى لباقة الاشتراك الكاملة',
      en: 'First main meal of the full subscription package',
    },
    calories: 480,
    proteinGrams: 42,
    ingredients: [
      { id: 'i1', name: { ar: 'صدر دجاج', en: 'Chicken breast' }, amount: { ar: '160 جم', en: '160 g' } },
      { id: 'i2', name: { ar: 'كينوا مطبوخة', en: 'Cooked quinoa' }, amount: { ar: '90 جم', en: '90 g' } },
      { id: 'i3', name: { ar: 'بروكلي', en: 'Broccoli' }, amount: { ar: '80 جم', en: '80 g' } },
      { id: 'i4', name: { ar: 'ثوم وليمون', en: 'Garlic & lemon' }, amount: { ar: 'حسب التتبيل', en: 'To taste' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'درجة داخلية 74°م · بدون مكسرات', en: 'Internal 74°C · no nuts' },
  },
  {
    id: 'mn-2',
    slot: 'main',
    slotLabel: { ar: 'وجبة رئيسية 2', en: 'Main meal 2' },
    slotIndex: 2,
    name: { ar: 'سلمون مشوي + خضار مشكلة', en: 'Grilled salmon + mixed veggies' },
    description: {
      ar: 'الوجبة الرئيسية الثانية حسب اختيار العميل لليوم',
      en: 'Second main meal per customer day selection',
    },
    calories: 510,
    proteinGrams: 38,
    ingredients: [
      { id: 'i1', name: { ar: 'سلمون', en: 'Salmon' }, amount: { ar: '150 جم', en: '150 g' }, allergen: true },
      { id: 'i2', name: { ar: 'كوسا وجزر', en: 'Zucchini & carrot' }, amount: { ar: '100 جم', en: '100 g' } },
      { id: 'i3', name: { ar: 'أرز بني', en: 'Brown rice' }, amount: { ar: '70 جم', en: '70 g' } },
      { id: 'i4', name: { ar: 'شبت وزيتون', en: 'Dill & olives' }, amount: { ar: '10 جم', en: '10 g' } },
    ],
    allergyFlags: [{ ar: 'سمك', en: 'Fish' }],
    prepNote: { ar: 'حساسية سمك ظاهرة على الملصق', en: 'Fish allergy must show on label' },
  },
  {
    id: 'sn-1',
    slot: 'snack',
    slotLabel: { ar: 'سناك', en: 'Snack' },
    slotIndex: 1,
    name: { ar: 'زبادي يوناني + توت', en: 'Greek yogurt + berries' },
    description: {
      ar: 'سناك الباقة الكاملة',
      en: 'Full-package snack',
    },
    calories: 180,
    proteinGrams: 14,
    ingredients: [
      { id: 'i1', name: { ar: 'زبادي يوناني', en: 'Greek yogurt' }, amount: { ar: '120 جم', en: '120 g' }, allergen: true },
      { id: 'i2', name: { ar: 'توت مشكل', en: 'Mixed berries' }, amount: { ar: '40 جم', en: '40 g' } },
      { id: 'i3', name: { ar: 'بذور شيا', en: 'Chia seeds' }, amount: { ar: '5 جم', en: '5 g' } },
    ],
    allergyFlags: [{ ar: 'ألبان', en: 'Dairy' }],
    prepNote: { ar: 'يُبرَّد حتى التسليم', en: 'Keep chilled until handover' },
  },
  {
    id: 'sd-1',
    slot: 'salad',
    slotLabel: { ar: 'سلطة', en: 'Salad' },
    slotIndex: 1,
    name: { ar: 'سلطة خضراء بزيت الزيتون', en: 'Green salad with olive oil' },
    description: {
      ar: 'سلطة الباقة الكاملة حسب F02',
      en: 'Full-package salad per F02',
    },
    calories: 140,
    proteinGrams: 4,
    ingredients: [
      { id: 'i1', name: { ar: 'خس روماني', en: 'Romaine lettuce' }, amount: { ar: '60 جم', en: '60 g' } },
      { id: 'i2', name: { ar: 'خيار وطماطم', en: 'Cucumber & tomato' }, amount: { ar: '80 جم', en: '80 g' } },
      { id: 'i3', name: { ar: 'زيت زيتون وليمون', en: 'Olive oil & lemon' }, amount: { ar: '10 مل', en: '10 ml' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'تُعبَّأ منفصلة عن الوجبات الساخنة', en: 'Pack separate from hot meals' },
  },
];

const lunchBoxMealsOrd2419: BoxMealItem[] = [
  {
    id: 'mn-1',
    slot: 'main',
    slotLabel: { ar: 'وجبة رئيسية', en: 'Main meal' },
    slotIndex: 1,
    name: { ar: 'صدر دجاج تكا + أرز بني', en: 'Chicken tikka + brown rice' },
    description: {
      ar: 'الوجبة الرئيسية لباقة الغداء',
      en: 'Main meal for the lunch package',
    },
    calories: 520,
    proteinGrams: 40,
    ingredients: [
      { id: 'i1', name: { ar: 'دجاج متبّل', en: 'Marinated chicken' }, amount: { ar: '170 جم', en: '170 g' } },
      { id: 'i2', name: { ar: 'أرز بني', en: 'Brown rice' }, amount: { ar: '90 جم', en: '90 g' } },
      { id: 'i3', name: { ar: 'زبادي خفيف', en: 'Light yogurt' }, amount: { ar: '30 جم', en: '30 g' }, allergen: true },
    ],
    allergyFlags: [{ ar: 'ألبان', en: 'Dairy' }],
    prepNote: { ar: 'تتبيل بدون مكسرات', en: 'Marinade without nuts' },
  },
  {
    id: 'sd-1',
    slot: 'salad',
    slotLabel: { ar: 'سلطة', en: 'Salad' },
    slotIndex: 1,
    name: { ar: 'سلطة كولسلو خفيفة', en: 'Light coleslaw salad' },
    description: {
      ar: 'سلطة باقة الغداء',
      en: 'Lunch-package salad',
    },
    calories: 110,
    proteinGrams: 3,
    ingredients: [
      { id: 'i1', name: { ar: 'ملفوف', en: 'Cabbage' }, amount: { ar: '70 جم', en: '70 g' } },
      { id: 'i2', name: { ar: 'جزر', en: 'Carrot' }, amount: { ar: '30 جم', en: '30 g' } },
      { id: 'i3', name: { ar: 'صلصة خفيفة', en: 'Light dressing' }, amount: { ar: '15 مل', en: '15 ml' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'بدون مايونيز كامل الدسم', en: 'No full-fat mayo' },
  },
];

const fullBoxMealsOrd2420: BoxMealItem[] = [
  {
    id: 'bf-1',
    slot: 'breakfast',
    slotLabel: { ar: 'إفطار', en: 'Breakfast' },
    slotIndex: 1,
    name: { ar: 'شوفان بروتين بالتوت', en: 'Protein oats with berries' },
    description: { ar: 'إفطار برنامج العضلات · نخبة', en: 'Muscle Elite breakfast' },
    calories: 390,
    proteinGrams: 32,
    ingredients: [
      { id: 'i1', name: { ar: 'شوفان', en: 'Oats' }, amount: { ar: '60 جم', en: '60 g' } },
      { id: 'i2', name: { ar: 'واي بروتين', en: 'Whey protein' }, amount: { ar: '25 جم', en: '25 g' }, allergen: true },
      { id: 'i3', name: { ar: 'توت أزرق', en: 'Blueberries' }, amount: { ar: '40 جم', en: '40 g' } },
    ],
    allergyFlags: [{ ar: 'ألبان', en: 'Dairy' }],
    prepNote: { ar: 'يُخلط قبل الإغلاق مباشرة', en: 'Mix just before sealing' },
  },
  {
    id: 'mn-1',
    slot: 'main',
    slotLabel: { ar: 'وجبة رئيسية 1', en: 'Main meal 1' },
    slotIndex: 1,
    name: { ar: 'لحم بقري قليل الدهن', en: 'Lean beef bowl' },
    description: { ar: 'حصة نخبة مضاعفة البروتين', en: 'Elite high-protein portion' },
    calories: 560,
    proteinGrams: 48,
    ingredients: [
      { id: 'i1', name: { ar: 'لحم بقري', en: 'Lean beef' }, amount: { ar: '180 جم', en: '180 g' } },
      { id: 'i2', name: { ar: 'بطاطا حلوة', en: 'Sweet potato' }, amount: { ar: '100 جم', en: '100 g' } },
      { id: 'i3', name: { ar: 'فاصوليا خضراء', en: 'Green beans' }, amount: { ar: '70 جم', en: '70 g' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'نضج متوسط · بدون زبدة', en: 'Medium cook · no butter' },
  },
  {
    id: 'mn-2',
    slot: 'main',
    slotLabel: { ar: 'وجبة رئيسية 2', en: 'Main meal 2' },
    slotIndex: 2,
    name: { ar: 'ستيك فيليه + بروكلي', en: 'Fillet steak + broccoli' },
    description: { ar: 'الوجبة الرئيسية الثانية للبوكس', en: 'Second main meal in the box' },
    calories: 540,
    proteinGrams: 46,
    ingredients: [
      { id: 'i1', name: { ar: 'فيليه بقري', en: 'Beef fillet' }, amount: { ar: '170 جم', en: '170 g' } },
      { id: 'i2', name: { ar: 'بروكلي', en: 'Broccoli' }, amount: { ar: '90 جم', en: '90 g' } },
      { id: 'i3', name: { ar: 'أرز بسمتي', en: 'Basmati rice' }, amount: { ar: '80 جم', en: '80 g' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'يُقطع بعد الراحة 3 دقائق', en: 'Rest 3 minutes before slicing' },
  },
  {
    id: 'sn-1',
    slot: 'snack',
    slotLabel: { ar: 'سناك', en: 'Snack' },
    slotIndex: 1,
    name: { ar: 'بيض مسلوق + خيار', en: 'Boiled eggs + cucumber' },
    description: { ar: 'سناك عالي البروتين', en: 'High-protein snack' },
    calories: 200,
    proteinGrams: 16,
    ingredients: [
      { id: 'i1', name: { ar: 'بيض مسلوق', en: 'Boiled eggs' }, amount: { ar: '2 حبة', en: '2 pcs' }, allergen: true },
      { id: 'i2', name: { ar: 'خيار', en: 'Cucumber' }, amount: { ar: '80 جم', en: '80 g' } },
    ],
    allergyFlags: [{ ar: 'بيض', en: 'Eggs' }],
    prepNote: { ar: 'يُبرَّد بعد السلق مباشرة', en: 'Chill immediately after boiling' },
  },
  {
    id: 'sd-1',
    slot: 'salad',
    slotLabel: { ar: 'سلطة', en: 'Salad' },
    slotIndex: 1,
    name: { ar: 'سلطة كينوا وخضار', en: 'Quinoa veggie salad' },
    description: { ar: 'سلطة الباقة الكاملة', en: 'Full-package salad' },
    calories: 160,
    proteinGrams: 6,
    ingredients: [
      { id: 'i1', name: { ar: 'كينوا', en: 'Quinoa' }, amount: { ar: '50 جم', en: '50 g' } },
      { id: 'i2', name: { ar: 'فلفل ألوان', en: 'Bell peppers' }, amount: { ar: '60 جم', en: '60 g' } },
      { id: 'i3', name: { ar: 'بقدونس وليمون', en: 'Parsley & lemon' }, amount: { ar: 'حسب التتبيل', en: 'To taste' } },
    ],
    allergyFlags: [],
    prepNote: { ar: 'تُخلط قبل الإغلاق', en: 'Toss before sealing' },
  },
];

export const ORDER_DETAIL_MOCKS: Record<string, OrderDetailData> = {
  'ORD-2418': {
    id: 'do-1',
    orderCode: 'ORD-2418',
    batchCode: 'BATCH-11',
    status: 'preparing',
    shift: 'noon',
    shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
    title: { ar: 'تفاصيل الطلب', en: 'Order details' },
    subtitle: {
      ar: 'بوكس اشتراك كامل · تجهيز كل خانات الباقة',
      en: 'Full subscription box · prep every package slot',
    },
    customerMaskedId: 'CUS-•••418',
    deliveryDateLabel: { ar: 'السبت 11 يوليو 2026', en: 'Saturday, 11 Jul 2026' },
    deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
    programLabel: { ar: 'لياقة', en: 'Fitness' },
    tierLabel: { ar: 'بلاتينيوم', en: 'Platinum' },
    bundleKind: 'full',
    bundleLabel: { ar: 'باقة كاملة', en: 'Full package' },
    boxCompositionLabel: fullComposition,
    boxCount: 1,
    driverCode: null,
    barcodeCode: null,
    windowLabel: { ar: 'نافذة -24س', en: '-24h window' },
    privacyNote,
    facts: [
      {
        id: 'bundle',
        label: { ar: 'باقة الاشتراك', en: 'Subscription bundle' },
        value: { ar: 'باقة كاملة', en: 'Full package' },
        icon: 'lucideLayers',
      },
      {
        id: 'slots',
        label: { ar: 'خانات البوكس', en: 'Box slots' },
        value: { ar: '5 عناصر', en: '5 items' },
        icon: 'lucidePackage',
      },
      {
        id: 'slot',
        label: { ar: 'وقت التسليم', en: 'Delivery slot' },
        value: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
        icon: 'lucideClock',
      },
      {
        id: 'window',
        label: { ar: 'النافذة', en: 'Window' },
        value: { ar: 'تحضير نهائي', en: 'Final prep' },
        icon: 'lucideTimer',
      },
    ],
    slotSummary: fullSlotSummary(),
    meals: fullBoxMealsOrd2418,
    checklist: [
      {
        id: 'c1',
        label: { ar: 'تأكيد الطلب (-72س)', en: 'Order confirmed (-72h)' },
        done: true,
        hint: { ar: 'تم أمس 18:40', en: 'Done yesterday 18:40' },
      },
      {
        id: 'c2',
        label: { ar: 'تجهيز 5 خانات الباقة', en: 'Prep all 5 package slots' },
        done: false,
        hint: { ar: 'إفطار · 2 رئيسية · سناك · سلطة', en: 'Breakfast · 2 mains · snack · salad' },
      },
      {
        id: 'c3',
        label: { ar: 'ملصق وباركود لكل وجبة', en: 'Label & barcode per meal' },
        done: false,
        hint: { ar: 'يُطبع بعد اكتمال التحضير', en: 'Print after prep completes' },
      },
      {
        id: 'c4',
        label: { ar: 'تسليم للسائق', en: 'Driver handover' },
        done: false,
        hint: { ar: 'بانتظار تعيين سائق', en: 'Waiting for driver assignment' },
      },
    ],
    timeline: [
      {
        id: 't1',
        title: { ar: 'بدأ تحضير البوكس', en: 'Box prep started' },
        detail: { ar: 'المطبخ استلم خانات الباقة الكاملة', en: 'Kitchen received full-package slots' },
        time: { ar: 'منذ 35 د', en: '35m ago' },
        tone: 'info',
      },
      {
        id: 't2',
        title: { ar: 'توليد فاتورة', en: 'Invoice generated' },
        detail: { ar: 'INV-2418 ضمن دفعة الظهيرة', en: 'INV-2418 in noon batch' },
        time: { ar: 'منذ ساعة', en: '1h ago' },
        tone: 'success',
      },
      {
        id: 't3',
        title: { ar: 'قفل تعديل العميل', en: 'Customer edit locked' },
        detail: { ar: 'انتهت نافذة 72 ساعة', en: '72h window closed' },
        time: { ar: 'أمس', en: 'Yesterday' },
        tone: 'warning',
      },
    ],
    actions: [
      {
        id: 'prep',
        label: { ar: 'تحديث التحضير', en: 'Update prep' },
        route: '/restaurant/orders/upcoming-24h',
        primary: true,
        icon: 'lucideChefHat',
      },
      {
        id: 'labels',
        label: { ar: 'طباعة الملصقات', en: 'Print labels' },
        route: '/restaurant/orders/labels',
        icon: 'lucidePrinter',
      },
      {
        id: 'drivers',
        label: { ar: 'تعيين سائق', en: 'Assign driver' },
        route: '/restaurant/delivery/drivers',
        icon: 'lucideTruck',
      },
    ],
  },
  'ORD-2419': {
    id: 'do-2',
    orderCode: 'ORD-2419',
    batchCode: 'BATCH-11',
    status: 'ready',
    shift: 'noon',
    shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
    title: { ar: 'تفاصيل الطلب', en: 'Order details' },
    subtitle: {
      ar: 'بوكس باقة الغداء · وجبة رئيسية + سلطة',
      en: 'Lunch-package box · main + salad',
    },
    customerMaskedId: 'CUS-•••419',
    deliveryDateLabel: { ar: 'السبت 11 يوليو 2026', en: 'Saturday, 11 Jul 2026' },
    deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
    programLabel: { ar: 'رشاقة', en: 'Slim' },
    tierLabel: { ar: 'أساسي', en: 'Basic' },
    bundleKind: 'lunch',
    bundleLabel: { ar: 'باقة الغداء', en: 'Lunch package' },
    boxCompositionLabel: lunchComposition,
    boxCount: 1,
    driverCode: 'DRV-204',
    barcodeCode: 'MM-2419-B11',
    windowLabel: { ar: 'جاهز للمسح', en: 'Ready to scan' },
    privacyNote,
    facts: [
      {
        id: 'bundle',
        label: { ar: 'باقة الاشتراك', en: 'Subscription bundle' },
        value: { ar: 'باقة الغداء', en: 'Lunch package' },
        icon: 'lucideLayers',
      },
      {
        id: 'slots',
        label: { ar: 'خانات البوكس', en: 'Box slots' },
        value: { ar: '2 عناصر', en: '2 items' },
        icon: 'lucidePackage',
      },
      {
        id: 'driver',
        label: { ar: 'السائق', en: 'Driver' },
        value: { ar: 'DRV-204', en: 'DRV-204' },
        icon: 'lucideTruck',
      },
      {
        id: 'barcode',
        label: { ar: 'الباركود', en: 'Barcode' },
        value: { ar: 'MM-2419-B11', en: 'MM-2419-B11' },
        icon: 'lucideScanBarcode',
      },
    ],
    slotSummary: lunchSlotSummary(),
    meals: lunchBoxMealsOrd2419,
    checklist: [
      {
        id: 'c1',
        label: { ar: 'تأكيد الطلب (-72س)', en: 'Order confirmed (-72h)' },
        done: true,
        hint: { ar: 'مكتمل', en: 'Completed' },
      },
      {
        id: 'c2',
        label: { ar: 'تجهيز خانات باقة الغداء', en: 'Prep lunch-package slots' },
        done: true,
        hint: { ar: 'رئيسية + سلطة', en: 'Main + salad' },
      },
      {
        id: 'c3',
        label: { ar: 'ملصق وباركود', en: 'Label & barcode' },
        done: true,
        hint: { ar: 'مطبوع وجاهز', en: 'Printed and ready' },
      },
      {
        id: 'c4',
        label: { ar: 'تسليم للسائق', en: 'Driver handover' },
        done: false,
        hint: { ar: 'بانتظار المسح عند الاستلام', en: 'Awaiting pickup scan' },
      },
    ],
    timeline: [
      {
        id: 't1',
        title: { ar: 'البوكس جاهز', en: 'Box marked ready' },
        detail: { ar: 'تم إغلاق خانات باقة الغداء', en: 'Lunch-package slots closed' },
        time: { ar: 'منذ 12 د', en: '12m ago' },
        tone: 'success',
      },
      {
        id: 't2',
        title: { ar: 'تعيين سائق', en: 'Driver assigned' },
        detail: { ar: 'DRV-204 لدفعة BATCH-11', en: 'DRV-204 for BATCH-11' },
        time: { ar: 'منذ 20 د', en: '20m ago' },
        tone: 'info',
      },
    ],
    actions: [
      {
        id: 'handover',
        label: { ar: 'فتح التسليم', en: 'Open handover' },
        route: '/restaurant/orders/handover',
        primary: true,
        icon: 'lucideScanBarcode',
      },
      {
        id: 'labels',
        label: { ar: 'إعادة طباعة الملصق', en: 'Reprint label' },
        route: '/restaurant/orders/labels',
        icon: 'lucidePrinter',
      },
    ],
  },
  'ORD-2420': {
    id: 'do-3',
    orderCode: 'ORD-2420',
    batchCode: 'BATCH-12',
    status: 'waiting-driver',
    shift: 'evening',
    shiftLabel: { ar: 'مساء', en: 'Evening' },
    title: { ar: 'تفاصيل الطلب', en: 'Order details' },
    subtitle: {
      ar: 'بوكسان · باقة كاملة لكل اشتراك نخبة',
      en: 'Two boxes · full package for Elite subscription',
    },
    customerMaskedId: 'CUS-•••420',
    deliveryDateLabel: { ar: 'السبت 11 يوليو 2026', en: 'Saturday, 11 Jul 2026' },
    deliverySlotLabel: { ar: '18:00 – 20:00', en: '18:00 – 20:00' },
    programLabel: { ar: 'عضلات', en: 'Muscle' },
    tierLabel: { ar: 'نخبة', en: 'Elite' },
    bundleKind: 'full',
    bundleLabel: { ar: 'باقة كاملة', en: 'Full package' },
    boxCompositionLabel: fullComposition,
    boxCount: 2,
    driverCode: 'DRV-118',
    barcodeCode: 'MM-2420-B12',
    windowLabel: { ar: 'السائق في الطريق', en: 'Driver en route' },
    privacyNote,
    facts: [
      {
        id: 'bundle',
        label: { ar: 'باقة الاشتراك', en: 'Subscription bundle' },
        value: { ar: 'باقة كاملة ×2', en: 'Full package ×2' },
        icon: 'lucideLayers',
      },
      {
        id: 'slots',
        label: { ar: 'خانات لكل بوكس', en: 'Slots per box' },
        value: { ar: '5 عناصر', en: '5 items' },
        icon: 'lucidePackage',
      },
      {
        id: 'driver',
        label: { ar: 'السائق', en: 'Driver' },
        value: { ar: 'DRV-118', en: 'DRV-118' },
        icon: 'lucideTruck',
      },
      {
        id: 'barcode',
        label: { ar: 'الباركود', en: 'Barcode' },
        value: { ar: 'MM-2420-B12', en: 'MM-2420-B12' },
        icon: 'lucideScanBarcode',
      },
    ],
    slotSummary: fullSlotSummary(),
    meals: fullBoxMealsOrd2420,
    checklist: [
      {
        id: 'c1',
        label: { ar: 'تأكيد الطلب (-72س)', en: 'Order confirmed (-72h)' },
        done: true,
        hint: { ar: 'مكتمل', en: 'Completed' },
      },
      {
        id: 'c2',
        label: { ar: 'تجهيز بوكسين كاملين', en: 'Prep two full boxes' },
        done: true,
        hint: { ar: 'كل بوكس: إفطار + 2 رئيسية + سناك + سلطة', en: 'Each: breakfast + 2 mains + snack + salad' },
      },
      {
        id: 'c3',
        label: { ar: 'ملصق وباركود', en: 'Label & barcode' },
        done: true,
        hint: { ar: 'مطبوع', en: 'Printed' },
      },
      {
        id: 'c4',
        label: { ar: 'تسليم للسائق', en: 'Driver handover' },
        done: false,
        hint: { ar: 'السائق يقترب من المطعم', en: 'Driver approaching restaurant' },
      },
    ],
    timeline: [
      {
        id: 't1',
        title: { ar: 'السائق في الطريق', en: 'Driver en route' },
        detail: { ar: 'DRV-118 · ETA 8 د', en: 'DRV-118 · ETA 8m' },
        time: { ar: 'الآن', en: 'Now' },
        tone: 'warning',
      },
      {
        id: 't2',
        title: { ar: 'البوكسات جاهزة', en: 'Boxes ready' },
        detail: { ar: 'تم تجهيز صندوقين بالباقة الكاملة', en: 'Two full-package boxes staged' },
        time: { ar: 'منذ 15 د', en: '15m ago' },
        tone: 'success',
      },
    ],
    actions: [
      {
        id: 'handover',
        label: { ar: 'متابعة التسليم', en: 'Track handover' },
        route: '/restaurant/orders/handover',
        primary: true,
        icon: 'lucideScanBarcode',
      },
      {
        id: 'labels',
        label: { ar: 'عرض الملصقات', en: 'View labels' },
        route: '/restaurant/orders/labels',
        icon: 'lucidePrinter',
      },
    ],
  },
};

/** Fallback detail for any daily-order code — full package composition. */
export function buildFallbackOrderDetail(orderCode: string): OrderDetailData {
  return {
    ...ORDER_DETAIL_MOCKS['ORD-2418'],
    id: orderCode.toLowerCase(),
    orderCode,
    customerMaskedId: `CUS-•••${orderCode.slice(-3)}`,
    barcodeCode: null,
    driverCode: null,
    status: 'preparing',
  };
}
