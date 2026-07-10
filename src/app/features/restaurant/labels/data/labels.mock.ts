import { LabelJobItem, LabelsData, MealLabelSticker } from '../models/labels.model';

function stickers(
  orderCode: string,
  items: Array<{
    id: string;
    slotAr: string;
    slotEn: string;
    mealAr: string;
    mealEn: string;
    calories: number;
    protein: number;
    allergenAr?: string;
    allergenEn?: string;
  }>,
): MealLabelSticker[] {
  return items.map((item, index) => ({
    id: item.id,
    slotLabel: { ar: item.slotAr, en: item.slotEn },
    mealName: { ar: item.mealAr, en: item.mealEn },
    calories: item.calories,
    proteinGrams: item.protein,
    allergenNote:
      item.allergenAr && item.allergenEn
        ? { ar: item.allergenAr, en: item.allergenEn }
        : null,
    barcodeCode: `MM-${orderCode.replace('ORD-', '')}-L${String(index + 1).padStart(2, '0')}`,
  }));
}

const lunchStickers = (orderCode: string) =>
  stickers(orderCode, [
    {
      id: `${orderCode}-s1`,
      slotAr: 'رئيسية',
      slotEn: 'Main',
      mealAr: 'صدر دجاج مشوي + كينوا',
      mealEn: 'Grilled chicken + quinoa',
      calories: 420,
      protein: 38,
    },
    {
      id: `${orderCode}-s2`,
      slotAr: 'سلطة',
      slotEn: 'Salad',
      mealAr: 'سلطة كولسلو خفيفة',
      mealEn: 'Light coleslaw salad',
      calories: 110,
      protein: 3,
    },
  ]);

const fullStickers = (orderCode: string) =>
  stickers(orderCode, [
    {
      id: `${orderCode}-s1`,
      slotAr: 'إفطار',
      slotEn: 'Breakfast',
      mealAr: 'شوفان بروتين + توت',
      mealEn: 'Protein oats + berries',
      calories: 310,
      protein: 24,
      allergenAr: 'يحتوي حليب',
      allergenEn: 'Contains dairy',
    },
    {
      id: `${orderCode}-s2`,
      slotAr: 'رئيسية 1',
      slotEn: 'Main 1',
      mealAr: 'دجاج تكا + أرز بني',
      mealEn: 'Chicken tikka + brown rice',
      calories: 480,
      protein: 42,
    },
    {
      id: `${orderCode}-s3`,
      slotAr: 'رئيسية 2',
      slotEn: 'Main 2',
      mealAr: 'ستيك وبروكلي',
      mealEn: 'Steak & broccoli',
      calories: 450,
      protein: 40,
    },
    {
      id: `${orderCode}-s4`,
      slotAr: 'سناك',
      slotEn: 'Snack',
      mealAr: 'زبادي يوناني وتوت',
      mealEn: 'Greek yogurt & berries',
      calories: 180,
      protein: 16,
      allergenAr: 'يحتوي حليب',
      allergenEn: 'Contains dairy',
    },
    {
      id: `${orderCode}-s5`,
      slotAr: 'سلطة',
      slotEn: 'Salad',
      mealAr: 'سلطة كينوا وخضار',
      mealEn: 'Quinoa veggie salad',
      calories: 160,
      protein: 6,
    },
  ]);

function job(
  partial: Omit<LabelJobItem, 'stickers' | 'deliveryDateLabel'> & {
    stickers: MealLabelSticker[];
    deliveryDateLabel?: LabelJobItem['deliveryDateLabel'];
  },
): LabelJobItem {
  return {
    ...partial,
    deliveryDateLabel: partial.deliveryDateLabel ?? {
      ar: 'غداً · الأحد 12 يوليو',
      en: 'Tomorrow · Sun 12 Jul',
    },
  };
}

export const LABELS_MOCK: LabelsData = {
  title: {
    ar: 'الملصقات والباركود',
    en: 'Labels & barcodes',
  },
  subtitle: {
    ar: 'معاينة وطباعة ملصقات الوجبات والباركود بعد نافذة −24س · بدون بيانات عميل شخصية',
    en: 'Preview and print meal labels and barcodes after the −24h window · no customer PII',
  },
  dateLabel: {
    ar: 'السبت 11 يوليو 2026',
    en: 'Saturday, 11 Jul 2026',
  },
  printAllLabel: {
    ar: 'طباعة الجاهز',
    en: 'Print ready batch',
  },
  summaries: [
    {
      id: 'ready',
      label: { ar: 'جاهز للطباعة', en: 'Ready to print' },
      value: 4,
      hint: { ar: 'باركود وملصق مكتملان', en: 'Barcode & label complete' },
      tone: 'primary',
      icon: 'lucidePrinter',
    },
    {
      id: 'printed',
      label: { ar: 'طُبع اليوم', en: 'Printed today' },
      value: 3,
      hint: { ar: 'جاهز للتسليم', en: 'Ready for handover' },
      tone: 'accent',
      icon: 'lucideCheck',
    },
    {
      id: 'missing',
      label: { ar: 'ينقص باركود', en: 'Missing barcode' },
      value: 2,
      hint: { ar: 'بانتظار التوليد', en: 'Awaiting generation' },
      tone: 'warning',
      icon: 'lucideTriangleAlert',
    },
    {
      id: 'labels',
      label: { ar: 'ملصقات اليوم', en: 'Today’s labels' },
      value: 28,
      hint: { ar: 'عبر كل البوكسات', en: 'Across all boxes' },
      tone: 'neutral',
      icon: 'lucideQrCode',
    },
  ],
  jobs: [
    job({
      id: 'lb-1',
      orderCode: 'ORD-2419',
      batchCode: 'BATCH-11',
      barcodeCode: 'MM-2419-B11',
      mealLabel: {
        ar: 'باقة غداء · رئيسية + سلطة',
        en: 'Lunch package · main + salad',
      },
      slotLabel: { ar: '2 ملصقات', en: '2 labels' },
      programLabel: { ar: 'رشاقة · أساسي', en: 'Slim · Basic' },
      boxCount: 1,
      labelCount: 2,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'ready',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2419',
      stickers: lunchStickers('ORD-2419'),
    }),
    job({
      id: 'lb-2',
      orderCode: 'ORD-2420',
      batchCode: 'BATCH-12',
      barcodeCode: 'MM-2420-B12',
      mealLabel: {
        ar: 'باقة كاملة · لحم قليل الدهن',
        en: 'Full package · lean beef',
      },
      slotLabel: { ar: '10 ملصقات', en: '10 labels' },
      programLabel: { ar: 'عضلات · نخبة', en: 'Muscle · Elite' },
      boxCount: 2,
      labelCount: 10,
      shift: 'evening',
      shiftLabel: { ar: 'مساء', en: 'Evening' },
      deliverySlotLabel: { ar: '18:00 – 20:00', en: '18:00 – 20:00' },
      status: 'ready',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2420',
      stickers: [
        ...fullStickers('ORD-2420'),
        ...fullStickers('ORD-2420B').map((s, i) => ({
          ...s,
          id: `ORD-2420-b2-${i}`,
          barcodeCode: `MM-2420-B2-L${String(i + 1).padStart(2, '0')}`,
        })),
      ],
    }),
    job({
      id: 'lb-3',
      orderCode: 'ORD-2424',
      batchCode: 'BATCH-11',
      barcodeCode: 'MM-2424-B11',
      mealLabel: {
        ar: 'باقة كاملة · سلمون + خضار',
        en: 'Full package · salmon + veggies',
      },
      slotLabel: { ar: '5 ملصقات', en: '5 labels' },
      programLabel: { ar: 'عضلات · بلاتينيوم', en: 'Muscle · Platinum' },
      boxCount: 1,
      labelCount: 5,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'ready',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2420',
      stickers: fullStickers('ORD-2424'),
    }),
    job({
      id: 'lb-4',
      orderCode: 'ORD-2425',
      batchCode: 'BATCH-13',
      barcodeCode: 'MM-2425-B13',
      mealLabel: {
        ar: 'باقة كاملة · كينوا + كولسلو',
        en: 'Full package · quinoa + coleslaw',
      },
      slotLabel: { ar: '5 ملصقات', en: '5 labels' },
      programLabel: { ar: 'لياقة · نخبة', en: 'Fitness · Elite' },
      boxCount: 1,
      labelCount: 5,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'ready',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2418',
      stickers: fullStickers('ORD-2425'),
    }),
    job({
      id: 'lb-5',
      orderCode: 'ORD-2418',
      batchCode: 'BATCH-11',
      barcodeCode: null,
      mealLabel: {
        ar: 'باقة كاملة · إفطار + 2 رئيسية + سناك + سلطة',
        en: 'Full package · breakfast + 2 mains + snack + salad',
      },
      slotLabel: { ar: '5 ملصقات', en: '5 labels' },
      programLabel: { ar: 'لياقة · بلاتينيوم', en: 'Fitness · Platinum' },
      boxCount: 1,
      labelCount: 5,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'missing',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2418',
      stickers: [],
    }),
    job({
      id: 'lb-6',
      orderCode: 'ORD-2427',
      batchCode: 'BATCH-14',
      barcodeCode: null,
      mealLabel: {
        ar: 'باقة كاملة · ستيك وبروكلي',
        en: 'Full package · steak & broccoli',
      },
      slotLabel: { ar: '10 ملصقات', en: '10 labels' },
      programLabel: { ar: 'عضلات · أساسي', en: 'Muscle · Basic' },
      boxCount: 2,
      labelCount: 10,
      shift: 'evening',
      shiftLabel: { ar: 'مساء', en: 'Evening' },
      deliverySlotLabel: { ar: '18:00 – 20:00', en: '18:00 – 20:00' },
      status: 'missing',
      printedAtLabel: null,
      route: '/restaurant/orders/detail/ORD-2420',
      stickers: [],
    }),
    job({
      id: 'lb-7',
      orderCode: 'ORD-2421',
      batchCode: 'BATCH-10',
      barcodeCode: 'MM-2421-B10',
      mealLabel: {
        ar: 'باقة كاملة · دجاج تكا + أرز بني',
        en: 'Full package · chicken tikka + brown rice',
      },
      slotLabel: { ar: '5 ملصقات', en: '5 labels' },
      programLabel: { ar: 'لياقة · أساسي', en: 'Fitness · Basic' },
      boxCount: 1,
      labelCount: 5,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'printed',
      printedAtLabel: { ar: 'طُبع منذ 40 د', en: 'Printed 40m ago' },
      route: '/restaurant/orders/detail/ORD-2418',
      stickers: fullStickers('ORD-2421'),
    }),
    job({
      id: 'lb-8',
      orderCode: 'ORD-2422',
      batchCode: 'BATCH-10',
      barcodeCode: 'MM-2422-B10',
      mealLabel: {
        ar: 'باقة كاملة · شوفان بروتين + أومليت',
        en: 'Full package · protein oats + omelette',
      },
      slotLabel: { ar: '5 ملصقات', en: '5 labels' },
      programLabel: { ar: 'رشاقة · بلاتينيوم', en: 'Slim · Platinum' },
      boxCount: 1,
      labelCount: 5,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'printed',
      printedAtLabel: { ar: 'طُبع منذ ساعة', en: 'Printed 1h ago' },
      route: '/restaurant/orders/detail/ORD-2419',
      stickers: fullStickers('ORD-2422'),
    }),
    job({
      id: 'lb-9',
      orderCode: 'ORD-2426',
      batchCode: 'BATCH-13',
      barcodeCode: 'MM-2426-B13',
      mealLabel: {
        ar: 'باقة غداء · زبادي وتوت',
        en: 'Lunch package · yogurt & berries',
      },
      slotLabel: { ar: '2 ملصقات', en: '2 labels' },
      programLabel: { ar: 'رشاقة · أساسي', en: 'Slim · Basic' },
      boxCount: 1,
      labelCount: 2,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'printed',
      printedAtLabel: { ar: 'طُبع منذ 15 د', en: 'Printed 15m ago' },
      route: '/restaurant/orders/detail/ORD-2419',
      stickers: lunchStickers('ORD-2426'),
    }),
  ],
};
