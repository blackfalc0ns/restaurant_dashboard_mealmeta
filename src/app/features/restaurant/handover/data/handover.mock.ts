import {
  HandoverBoxScan,
  HandoverChecklistItem,
  HandoverDetailData,
  HandoverDriverInfo,
  HandoverFact,
  HandoverListData,
  HandoverListItem,
  HandoverMealItem,
  HandoverTimelineItem,
} from '../models/handover.model';

function item(
  partial: Omit<HandoverListItem, 'route'> & { route?: string },
): HandoverListItem {
  return {
    ...partial,
    route:
      partial.route ?? `/restaurant/orders/handover/${partial.orderCode}`,
  };
}

export const HANDOVER_LIST_MOCK: HandoverListData = {
  title: {
    ar: 'تسليم الطلبات',
    en: 'Order handover',
  },
  subtitle: {
    ar: 'طلبات استلمها المندوب أو بانتظار مسح الاستلام · جاري توصيلها للعميل',
    en: 'Orders taken by the driver or awaiting pickup scan · out for delivery',
  },
  dateLabel: {
    ar: 'السبت 11 يوليو 2026',
    en: 'Saturday, 11 Jul 2026',
  },
  windowHint: {
    ar: 'مسح الباركود عند الاستلام والتسليم',
    en: 'Barcode scan at pickup & delivery',
  },
  summaries: [
    {
      id: 'awaiting-pickup',
      label: { ar: 'بانتظار الاستلام', en: 'Awaiting pickup' },
      value: 3,
      hint: { ar: 'مندوب معيّن · لم يُمسح بعد', en: 'Driver assigned · not scanned yet' },
      tone: 'warning',
      icon: 'lucideScanBarcode',
    },
    {
      id: 'en-route',
      label: { ar: 'مع المندوب', en: 'With driver' },
      value: 4,
      hint: { ar: 'تم الاستلام · جاري التوصيل', en: 'Picked up · delivering' },
      tone: 'primary',
      icon: 'lucideTruck',
    },
    {
      id: 'delivered',
      label: { ar: 'تم التسليم اليوم', en: 'Delivered today' },
      value: 2,
      hint: { ar: 'مسح تسليم مكتمل', en: 'Delivery scan complete' },
      tone: 'accent',
      icon: 'lucideCheck',
    },
    {
      id: 'boxes',
      label: { ar: 'بوكسات اليوم', en: 'Today’s boxes' },
      value: 14,
      hint: { ar: 'عبر كل الطلبات', en: 'Across all handovers' },
      tone: 'neutral',
      icon: 'lucidePackage',
    },
  ],
  orders: [
    item({
      id: 'ho-1',
      orderCode: 'ORD-2419',
      batchCode: 'BATCH-11',
      customerMaskedId: 'CUS-•••419',
      driverCode: 'DRV-204',
      barcodeCode: 'MM-2419-B1',
      mealSummary: {
        ar: 'باقة غداء · رئيسية + سلطة',
        en: 'Lunch package · main + salad',
      },
      programLabel: { ar: 'رشاقة · أساسي', en: 'Slim · Basic' },
      bundleLabel: { ar: 'غداء', en: 'Lunch' },
      boxCount: 1,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'awaiting-pickup',
      statusHint: {
        ar: 'المندوب في المطعم · بانتظار مسح الاستلام',
        en: 'Driver at restaurant · awaiting pickup scan',
      },
      pickedUpAtLabel: null,
      etaLabel: { ar: 'خلال 25 د', en: 'In 25m' },
    }),
    item({
      id: 'ho-2',
      orderCode: 'ORD-2420',
      batchCode: 'BATCH-12',
      customerMaskedId: 'CUS-•••420',
      driverCode: 'DRV-118',
      barcodeCode: 'MM-2420-B1',
      mealSummary: {
        ar: 'باقة كاملة · لحم قليل الدهن',
        en: 'Full package · lean beef',
      },
      programLabel: { ar: 'عضلات · نخبة', en: 'Muscle · Elite' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 2,
      shift: 'evening',
      shiftLabel: { ar: 'مساء', en: 'Evening' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '18:00 – 20:00', en: '18:00 – 20:00' },
      status: 'en-route',
      statusHint: {
        ar: 'تم استلام البوكسات · في الطريق',
        en: 'Boxes picked up · en route',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ 18 د', en: 'Picked up 18m ago' },
      etaLabel: { ar: 'خلال 35 د', en: 'In 35m' },
    }),
    item({
      id: 'ho-3',
      orderCode: 'ORD-2424',
      batchCode: 'BATCH-11',
      customerMaskedId: 'CUS-•••424',
      driverCode: 'DRV-204',
      barcodeCode: 'MM-2424-B1',
      mealSummary: {
        ar: 'باقة كاملة · سلمون + خضار',
        en: 'Full package · salmon + veggies',
      },
      programLabel: { ar: 'عضلات · بلاتينيوم', en: 'Muscle · Platinum' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 1,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'awaiting-pickup',
      statusHint: {
        ar: 'جاهز على طاولة التسليم',
        en: 'Ready on handover counter',
      },
      pickedUpAtLabel: null,
      etaLabel: { ar: 'خلال 40 د', en: 'In 40m' },
    }),
    item({
      id: 'ho-4',
      orderCode: 'ORD-2425',
      batchCode: 'BATCH-13',
      customerMaskedId: 'CUS-•••425',
      driverCode: 'DRV-091',
      barcodeCode: 'MM-2425-B1',
      mealSummary: {
        ar: 'باقة كاملة · كينوا + كولسلو',
        en: 'Full package · quinoa + coleslaw',
      },
      programLabel: { ar: 'لياقة · نخبة', en: 'Fitness · Elite' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 1,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'en-route',
      statusHint: {
        ar: 'المندوب غادر المطعم',
        en: 'Driver left the restaurant',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ 55 د', en: 'Picked up 55m ago' },
      etaLabel: { ar: 'خلال 12 د', en: 'In 12m' },
    }),
    item({
      id: 'ho-5',
      orderCode: 'ORD-2421',
      batchCode: 'BATCH-10',
      customerMaskedId: 'CUS-•••421',
      driverCode: 'DRV-118',
      barcodeCode: 'MM-2421-B1',
      mealSummary: {
        ar: 'باقة كاملة · دجاج تكا + أرز بني',
        en: 'Full package · chicken tikka + brown rice',
      },
      programLabel: { ar: 'لياقة · أساسي', en: 'Fitness · Basic' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 1,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'delivered',
      statusHint: {
        ar: 'تم مسح التسليم بنجاح',
        en: 'Delivery scan completed',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ ساعتين', en: 'Picked up 2h ago' },
      etaLabel: { ar: 'تم التسليم', en: 'Delivered' },
    }),
    item({
      id: 'ho-6',
      orderCode: 'ORD-2422',
      batchCode: 'BATCH-10',
      customerMaskedId: 'CUS-•••422',
      driverCode: 'DRV-091',
      barcodeCode: 'MM-2422-B1',
      mealSummary: {
        ar: 'باقة كاملة · شوفان بروتين + أومليت',
        en: 'Full package · protein oats + omelette',
      },
      programLabel: { ar: 'رشاقة · بلاتينيوم', en: 'Slim · Platinum' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 1,
      shift: 'morning',
      shiftLabel: { ar: 'صباح', en: 'Morning' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '08:00 – 10:00', en: '08:00 – 10:00' },
      status: 'delivered',
      statusHint: {
        ar: 'تم التسليم · بدون شكاوى',
        en: 'Delivered · no complaints',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ 3س', en: 'Picked up 3h ago' },
      etaLabel: { ar: 'تم التسليم', en: 'Delivered' },
    }),
    item({
      id: 'ho-7',
      orderCode: 'ORD-2426',
      batchCode: 'BATCH-13',
      customerMaskedId: 'CUS-•••426',
      driverCode: 'DRV-204',
      barcodeCode: 'MM-2426-B1',
      mealSummary: {
        ar: 'باقة غداء · زبادي وتوت',
        en: 'Lunch package · yogurt & berries',
      },
      programLabel: { ar: 'رشاقة · أساسي', en: 'Slim · Basic' },
      bundleLabel: { ar: 'غداء', en: 'Lunch' },
      boxCount: 1,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'en-route',
      statusHint: {
        ar: 'قريب من منطقة التسليم',
        en: 'Near delivery zone',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ 8 د', en: 'Picked up 8m ago' },
      etaLabel: { ar: 'خلال 15 د', en: 'In 15m' },
    }),
    item({
      id: 'ho-8',
      orderCode: 'ORD-2427',
      batchCode: 'BATCH-14',
      customerMaskedId: 'CUS-•••427',
      driverCode: 'DRV-118',
      barcodeCode: 'MM-2427-B1',
      mealSummary: {
        ar: 'باقة كاملة · ستيك وبروكلي',
        en: 'Full package · steak & broccoli',
      },
      programLabel: { ar: 'عضلات · أساسي', en: 'Muscle · Basic' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 2,
      shift: 'evening',
      shiftLabel: { ar: 'مساء', en: 'Evening' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '18:00 – 20:00', en: '18:00 – 20:00' },
      status: 'awaiting-pickup',
      statusHint: {
        ar: 'المندوب في الطريق للمطعم',
        en: 'Driver heading to restaurant',
      },
      pickedUpAtLabel: null,
      etaLabel: { ar: 'خلال 50 د', en: 'In 50m' },
    }),
    item({
      id: 'ho-9',
      orderCode: 'ORD-2418',
      batchCode: 'BATCH-11',
      customerMaskedId: 'CUS-•••418',
      driverCode: 'DRV-091',
      barcodeCode: 'MM-2418-B1',
      mealSummary: {
        ar: 'باقة كاملة · إفطار + 2 رئيسية + سناك + سلطة',
        en: 'Full package · breakfast + 2 mains + snack + salad',
      },
      programLabel: { ar: 'لياقة · بلاتينيوم', en: 'Fitness · Platinum' },
      bundleLabel: { ar: 'كاملة', en: 'Full' },
      boxCount: 1,
      shift: 'noon',
      shiftLabel: { ar: 'ظهيرة', en: 'Noon' },
      deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
      deliverySlotLabel: { ar: '12:00 – 14:00', en: '12:00 – 14:00' },
      status: 'en-route',
      statusHint: {
        ar: 'تم استلام البوكس · جاري التوصيل',
        en: 'Box picked up · delivering',
      },
      pickedUpAtLabel: { ar: 'استُلم منذ 22 د', en: 'Picked up 22m ago' },
      etaLabel: { ar: 'خلال 28 د', en: 'In 28m' },
    }),
  ],
};

const FULL_MEALS: Omit<HandoverMealItem, 'id' | 'barcodeCode'>[] = [
  {
    slotLabel: { ar: 'إفطار', en: 'Breakfast' },
    mealName: { ar: 'شوفان بروتين + توت', en: 'Protein oats + berries' },
    calories: 310,
    proteinGrams: 24,
    allergenNote: { ar: 'يحتوي حليب', en: 'Contains dairy' },
  },
  {
    slotLabel: { ar: 'رئيسية 1', en: 'Main 1' },
    mealName: { ar: 'دجاج تكا + أرز بني', en: 'Chicken tikka + brown rice' },
    calories: 480,
    proteinGrams: 42,
    allergenNote: null,
  },
  {
    slotLabel: { ar: 'رئيسية 2', en: 'Main 2' },
    mealName: { ar: 'ستيك وبروكلي', en: 'Steak & broccoli' },
    calories: 450,
    proteinGrams: 40,
    allergenNote: null,
  },
  {
    slotLabel: { ar: 'سناك', en: 'Snack' },
    mealName: { ar: 'زبادي يوناني وتوت', en: 'Greek yogurt & berries' },
    calories: 180,
    proteinGrams: 16,
    allergenNote: { ar: 'يحتوي حليب', en: 'Contains dairy' },
  },
  {
    slotLabel: { ar: 'سلطة', en: 'Salad' },
    mealName: { ar: 'سلطة كينوا وخضار', en: 'Quinoa veggie salad' },
    calories: 160,
    proteinGrams: 6,
    allergenNote: null,
  },
];

const LUNCH_MEALS: Omit<HandoverMealItem, 'id' | 'barcodeCode'>[] = [
  {
    slotLabel: { ar: 'رئيسية', en: 'Main' },
    mealName: { ar: 'صدر دجاج مشوي + كينوا', en: 'Grilled chicken + quinoa' },
    calories: 420,
    proteinGrams: 38,
    allergenNote: null,
  },
  {
    slotLabel: { ar: 'سلطة', en: 'Salad' },
    mealName: { ar: 'سلطة كولسلو خفيفة', en: 'Light coleslaw salad' },
    calories: 110,
    proteinGrams: 3,
    allergenNote: null,
  },
];

function mealsFor(
  orderCode: string,
  boxIndex: number,
  kind: 'full' | 'lunch',
): HandoverMealItem[] {
  const code = orderCode.replace('ORD-', '');
  const source = kind === 'lunch' ? LUNCH_MEALS : FULL_MEALS;
  return source.map((meal, index) => ({
    ...meal,
    id: `${orderCode}-b${boxIndex}-m${index + 1}`,
    barcodeCode: `MM-${code}-B${boxIndex}-L${String(index + 1).padStart(2, '0')}`,
  }));
}

function makeBox(
  orderCode: string,
  boxIndex: number,
  kind: 'full' | 'lunch',
  scans: {
    pickupScanned: boolean;
    deliveryScanned: boolean;
    pickupAtLabel: HandoverBoxScan['pickupAtLabel'];
    deliveryAtLabel: HandoverBoxScan['deliveryAtLabel'];
  },
): HandoverBoxScan {
  const code = orderCode.replace('ORD-', '');
  const meals = mealsFor(orderCode, boxIndex, kind);
  return {
    id: `${orderCode}-box-${boxIndex}`,
    boxIndex,
    boxLabel: { ar: `بوكس ${boxIndex}`, en: `Box ${boxIndex}` },
    boxBarcode: `MM-${code}-B${boxIndex}`,
    invoiceCode: `INV-${code}-B${boxIndex}`,
    mealCount: meals.length,
    meals,
    ...scans,
  };
}

function driverInfo(
  code: string,
  zoneAr: string,
  zoneEn: string,
  pingAr: string,
  pingEn: string,
  bags: number,
): HandoverDriverInfo {
  return {
    code,
    vehicleLabel: { ar: 'دراجة نارية مبرّدة', en: 'Chilled motorcycle' },
    bagsLabel: {
      ar: `${bags} حقيبة حرارية`,
      en: `${bags} thermal bag${bags === 1 ? '' : 's'}`,
    },
    zoneLabel: { ar: zoneAr, en: zoneEn },
    lastPingLabel: { ar: pingAr, en: pingEn },
    contactRule: {
      ar: 'لا يظهر رقم العميل · التواصل عبر التطبيق فقط',
      en: 'Customer phone hidden · in-app contact only',
    },
  };
}

function factsFor(
  order: HandoverListItem,
  zone: { ar: string; en: string },
  tier: { ar: string; en: string },
): HandoverFact[] {
  return [
    {
      id: 'program',
      label: { ar: 'البرنامج', en: 'Program' },
      value: order.programLabel,
      icon: 'lucidePackage',
    },
    {
      id: 'bundle',
      label: { ar: 'الباقة', en: 'Bundle' },
      value: order.bundleLabel,
      icon: 'lucidePackage',
    },
    {
      id: 'tier',
      label: { ar: 'التصنيف', en: 'Tier' },
      value: tier,
      icon: 'lucideCheck',
    },
    {
      id: 'boxes',
      label: { ar: 'البوكسات', en: 'Boxes' },
      value: {
        ar: `${order.boxCount} بوكس`,
        en: `${order.boxCount} box${order.boxCount === 1 ? '' : 'es'}`,
      },
      icon: 'lucidePackage',
    },
    {
      id: 'slot',
      label: { ar: 'نافذة التوصيل', en: 'Delivery window' },
      value: order.deliverySlotLabel,
      icon: 'lucideTruck',
    },
    {
      id: 'zone',
      label: { ar: 'منطقة التسليم', en: 'Delivery zone' },
      value: zone,
      icon: 'lucideTruck',
    },
    {
      id: 'customer',
      label: { ar: 'العميل', en: 'Customer' },
      value: { ar: order.customerMaskedId, en: order.customerMaskedId },
      icon: 'lucideScanBarcode',
    },
    {
      id: 'eta',
      label: { ar: 'الوصول المتوقع', en: 'ETA' },
      value: order.etaLabel,
      icon: 'lucideTruck',
    },
  ];
}

function checklistFor(
  status: HandoverListItem['status'],
  boxCount: number,
): HandoverChecklistItem[] {
  const picked = status !== 'awaiting-pickup';
  const delivered = status === 'delivered';
  return [
    {
      id: 'c1',
      label: { ar: 'الملصقات والفواتير مطبوعة', en: 'Labels & invoices printed' },
      done: true,
      hint: {
        ar: `${boxCount} فاتورة QR جاهزة`,
        en: `${boxCount} QR invoice${boxCount === 1 ? '' : 's'} ready`,
      },
    },
    {
      id: 'c2',
      label: { ar: 'البوكسات محكمة الإغلاق', en: 'Boxes sealed' },
      done: true,
      hint: {
        ar: 'جاهزة على طاولة التسليم',
        en: 'Ready on handover counter',
      },
    },
    {
      id: 'c3',
      label: { ar: 'مسح استلام المندوب', en: 'Driver pickup scan' },
      done: picked,
      hint: picked
        ? { ar: 'تم مسح كل البوكسات', en: 'All boxes scanned' }
        : { ar: 'بانتظار مسح الباركود', en: 'Awaiting barcode scan' },
    },
    {
      id: 'c4',
      label: { ar: 'مسح التسليم للعميل', en: 'Customer delivery scan' },
      done: delivered,
      hint: delivered
        ? { ar: 'اكتمل التسليم', en: 'Delivery completed' }
        : { ar: 'بعد وصول المندوب', en: 'After driver arrives' },
    },
  ];
}

function detailFromList(
  order: HandoverListItem,
  boxes: HandoverBoxScan[],
  timeline: HandoverTimelineItem[],
  extras: {
    driver: HandoverDriverInfo;
    zone: { ar: string; en: string };
    tier: { ar: string; en: string };
  } & Partial<HandoverDetailData>,
): HandoverDetailData {
  const { driver, zone, tier, ...rest } = extras;
  return {
    id: order.id,
    orderCode: order.orderCode,
    batchCode: order.batchCode,
    status: order.status,
    customerMaskedId: order.customerMaskedId,
    driverCode: order.driverCode,
    barcodeCode: order.barcodeCode,
    mealSummary: order.mealSummary,
    programLabel: order.programLabel,
    bundleLabel: order.bundleLabel,
    tierLabel: tier,
    boxCount: order.boxCount,
    shiftLabel: order.shiftLabel,
    deliveryDateLabel: order.deliveryDateLabel,
    deliverySlotLabel: order.deliverySlotLabel,
    deliveryZoneLabel: zone,
    etaLabel: order.etaLabel,
    pickedUpAtLabel: order.pickedUpAtLabel,
    privacyNote: {
      ar: 'بيانات العميل الشخصية مخفية. يظهر المعرّف المقنّع وكود المندوب ومنطقة التسليم فقط.',
      en: 'Customer personal data is hidden. Only masked ID, driver code, and delivery zone are shown.',
    },
    pickupHint: order.statusHint,
    driver,
    facts: factsFor(order, zone, tier),
    checklist: checklistFor(order.status, order.boxCount),
    boxes,
    timeline,
    labelsRoute: '/restaurant/orders/labels',
    listRoute: '/restaurant/orders/handover',
    orderDetailRoute: `/restaurant/orders/detail/${order.orderCode}`,
    ...rest,
  };
}

const listByCode = Object.fromEntries(
  HANDOVER_LIST_MOCK.orders.map((o) => [o.orderCode, o]),
) as Record<string, HandoverListItem>;

export const HANDOVER_DETAIL_MOCKS: Record<string, HandoverDetailData> = {
  'ORD-2419': detailFromList(
    listByCode['ORD-2419'],
    [
      makeBox('ORD-2419', 1, 'lunch', {
        pickupScanned: false,
        deliveryScanned: false,
        pickupAtLabel: null,
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'جاهز للتسليم', en: 'Ready for handover' },
        detail: {
          ar: 'الملصقات والفواتير مطبوعة',
          en: 'Labels & invoices printed',
        },
        time: { ar: 'منذ 35 د', en: '35m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'تعيين المندوب', en: 'Driver assigned' },
        detail: {
          ar: 'DRV-204 وصل لمنطقة المطعم',
          en: 'DRV-204 near restaurant',
        },
        time: { ar: 'منذ 8 د', en: '8m ago' },
        tone: 'info',
        done: true,
      },
      {
        id: 't3',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: {
          ar: 'بانتظار مسح باركود البوكس',
          en: 'Awaiting box barcode scan',
        },
        time: { ar: 'الآن', en: 'Now' },
        tone: 'warning',
        done: false,
      },
      {
        id: 't4',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: {
          ar: 'بعد وصول المندوب للعميل',
          en: 'After driver reaches customer',
        },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'info',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-204',
        'حي النرجس · الرياض',
        'Al Narjis · Riyadh',
        'آخر ظهور منذ دقيقة',
        'Last ping 1m ago',
        1,
      ),
      zone: { ar: 'حي النرجس', en: 'Al Narjis' },
      tier: { ar: 'أساسي', en: 'Basic' },
    },
  ),
  'ORD-2420': detailFromList(
    listByCode['ORD-2420'],
    [
      makeBox('ORD-2420', 1, 'full', {
        pickupScanned: true,
        deliveryScanned: false,
        pickupAtLabel: { ar: 'منذ 18 د', en: '18m ago' },
        deliveryAtLabel: null,
      }),
      makeBox('ORD-2420', 2, 'full', {
        pickupScanned: true,
        deliveryScanned: false,
        pickupAtLabel: { ar: 'منذ 18 د', en: '18m ago' },
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'جاهز للتسليم', en: 'Ready for handover' },
        detail: {
          ar: '2 بوكس · 10 ملصقات · فواتير QR جاهزة',
          en: '2 boxes · 10 labels · QR invoices ready',
        },
        time: { ar: 'منذ ساعة', en: '1h ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'تعيين المندوب', en: 'Driver assigned' },
        detail: {
          ar: 'DRV-118 · حقيبتان حراريتان',
          en: 'DRV-118 · 2 thermal bags',
        },
        time: { ar: 'منذ 40 د', en: '40m ago' },
        tone: 'info',
        done: true,
      },
      {
        id: 't3',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: {
          ar: 'تم مسح MM-2420-B1 و MM-2420-B2',
          en: 'Scanned MM-2420-B1 and MM-2420-B2',
        },
        time: { ar: 'منذ 18 د', en: '18m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't4',
        title: { ar: 'غادر المطعم', en: 'Left restaurant' },
        detail: {
          ar: 'في الطريق لمنطقة الياسمين',
          en: 'Heading to Al Yasmin zone',
        },
        time: { ar: 'منذ 16 د', en: '16m ago' },
        tone: 'info',
        done: true,
      },
      {
        id: 't5',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: {
          ar: 'متوقع خلال 35 دقيقة · بدون عنوان ظاهر',
          en: 'Expected in 35m · no address shown',
        },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'warning',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-118',
        'حي الياسمين · الرياض',
        'Al Yasmin · Riyadh',
        'آخر ظهور منذ 3 د · يتحرك',
        'Last ping 3m ago · moving',
        2,
      ),
      zone: { ar: 'حي الياسمين', en: 'Al Yasmin' },
      tier: { ar: 'نخبة', en: 'Elite' },
      pickupHint: {
        ar: 'تم استلام البوكسين · المندوب في الطريق لمنطقة الياسمين',
        en: 'Both boxes picked up · driver en route to Al Yasmin',
      },
    },
  ),
  'ORD-2424': detailFromList(
    listByCode['ORD-2424'],
    [
      makeBox('ORD-2424', 1, 'full', {
        pickupScanned: false,
        deliveryScanned: false,
        pickupAtLabel: null,
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'جاهز على الطاولة', en: 'Ready on counter' },
        detail: { ar: 'بانتظار وصول المندوب', en: 'Awaiting driver arrival' },
        time: { ar: 'منذ 12 د', en: '12m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: { ar: 'DRV-204 معيّن', en: 'DRV-204 assigned' },
        time: { ar: 'الآن', en: 'Now' },
        tone: 'warning',
        done: false,
      },
      {
        id: 't3',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: { ar: 'بعد الاستلام', en: 'After pickup' },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'info',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-204',
        'حي الملقا',
        'Al Malqa',
        'آخر ظهور منذ 6 د',
        'Last ping 6m ago',
        1,
      ),
      zone: { ar: 'حي الملقا', en: 'Al Malqa' },
      tier: { ar: 'بلاتينيوم', en: 'Platinum' },
    },
  ),
  'ORD-2425': detailFromList(
    listByCode['ORD-2425'],
    [
      makeBox('ORD-2425', 1, 'full', {
        pickupScanned: true,
        deliveryScanned: false,
        pickupAtLabel: { ar: 'منذ 55 د', en: '55m ago' },
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: {
          ar: 'DRV-091 استلم البوكس',
          en: 'DRV-091 picked up the box',
        },
        time: { ar: 'منذ 55 د', en: '55m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'في الطريق', en: 'En route' },
        detail: { ar: 'قريب من منطقة التسليم', en: 'Near delivery zone' },
        time: { ar: 'منذ 10 د', en: '10m ago' },
        tone: 'info',
        done: true,
      },
      {
        id: 't3',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: {
          ar: 'متوقع خلال 12 دقيقة',
          en: 'Expected in 12 minutes',
        },
        time: { ar: 'قريب', en: 'Soon' },
        tone: 'warning',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-091',
        'حي العقيق',
        'Al Aqiq',
        'آخر ظهور منذ دقيقتين',
        'Last ping 2m ago',
        1,
      ),
      zone: { ar: 'حي العقيق', en: 'Al Aqiq' },
      tier: { ar: 'نخبة', en: 'Elite' },
    },
  ),
  'ORD-2421': detailFromList(
    listByCode['ORD-2421'],
    [
      makeBox('ORD-2421', 1, 'full', {
        pickupScanned: true,
        deliveryScanned: true,
        pickupAtLabel: { ar: 'منذ ساعتين', en: '2h ago' },
        deliveryAtLabel: { ar: 'منذ 40 د', en: '40m ago' },
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: { ar: 'تم بنجاح', en: 'Completed' },
        time: { ar: 'منذ ساعتين', en: '2h ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: { ar: 'تم التسليم للعميل', en: 'Delivered to customer' },
        time: { ar: 'منذ 40 د', en: '40m ago' },
        tone: 'success',
        done: true,
      },
    ],
    {
      driver: driverInfo(
        'DRV-118',
        'حي النرجس',
        'Al Narjis',
        'آخر ظهور منذ 40 د',
        'Last ping 40m ago',
        1,
      ),
      zone: { ar: 'حي النرجس', en: 'Al Narjis' },
      tier: { ar: 'أساسي', en: 'Basic' },
    },
  ),
  'ORD-2422': detailFromList(
    listByCode['ORD-2422'],
    [
      makeBox('ORD-2422', 1, 'full', {
        pickupScanned: true,
        deliveryScanned: true,
        pickupAtLabel: { ar: 'منذ 3س', en: '3h ago' },
        deliveryAtLabel: { ar: 'منذ ساعة', en: '1h ago' },
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: { ar: 'تم بنجاح', en: 'Completed' },
        time: { ar: 'منذ 3س', en: '3h ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: { ar: 'تم بدون ملاحظات', en: 'Completed with no notes' },
        time: { ar: 'منذ ساعة', en: '1h ago' },
        tone: 'success',
        done: true,
      },
    ],
    {
      driver: driverInfo(
        'DRV-091',
        'حي الياسمين',
        'Al Yasmin',
        'آخر ظهور منذ ساعة',
        'Last ping 1h ago',
        1,
      ),
      zone: { ar: 'حي الياسمين', en: 'Al Yasmin' },
      tier: { ar: 'بلاتينيوم', en: 'Platinum' },
    },
  ),
  'ORD-2426': detailFromList(
    listByCode['ORD-2426'],
    [
      makeBox('ORD-2426', 1, 'lunch', {
        pickupScanned: true,
        deliveryScanned: false,
        pickupAtLabel: { ar: 'منذ 8 د', en: '8m ago' },
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: {
          ar: 'DRV-204 استلم البوكس',
          en: 'DRV-204 picked up the box',
        },
        time: { ar: 'منذ 8 د', en: '8m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'في الطريق', en: 'En route' },
        detail: { ar: 'قريب من منطقة التسليم', en: 'Near delivery zone' },
        time: { ar: 'الآن', en: 'Now' },
        tone: 'info',
        done: true,
      },
      {
        id: 't3',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: {
          ar: 'متوقع خلال 15 دقيقة',
          en: 'Expected in 15 minutes',
        },
        time: { ar: 'قريب', en: 'Soon' },
        tone: 'warning',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-204',
        'حي الملقا',
        'Al Malqa',
        'آخر ظهور منذ دقيقة',
        'Last ping 1m ago',
        1,
      ),
      zone: { ar: 'حي الملقا', en: 'Al Malqa' },
      tier: { ar: 'أساسي', en: 'Basic' },
    },
  ),
  'ORD-2427': detailFromList(
    listByCode['ORD-2427'],
    [
      makeBox('ORD-2427', 1, 'full', {
        pickupScanned: false,
        deliveryScanned: false,
        pickupAtLabel: null,
        deliveryAtLabel: null,
      }),
      makeBox('ORD-2427', 2, 'full', {
        pickupScanned: false,
        deliveryScanned: false,
        pickupAtLabel: null,
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'تعيين المندوب', en: 'Driver assigned' },
        detail: {
          ar: 'DRV-118 في الطريق للمطعم',
          en: 'DRV-118 heading to restaurant',
        },
        time: { ar: 'منذ 5 د', en: '5m ago' },
        tone: 'info',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: { ar: '2 بوكس بانتظار المسح', en: '2 boxes awaiting scan' },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'warning',
        done: false,
      },
      {
        id: 't3',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: { ar: 'بعد الاستلام', en: 'After pickup' },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'info',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-118',
        'حي العقيق',
        'Al Aqiq',
        'آخر ظهور منذ 4 د',
        'Last ping 4m ago',
        2,
      ),
      zone: { ar: 'حي العقيق', en: 'Al Aqiq' },
      tier: { ar: 'أساسي', en: 'Basic' },
    },
  ),
  'ORD-2418': detailFromList(
    listByCode['ORD-2418'],
    [
      makeBox('ORD-2418', 1, 'full', {
        pickupScanned: true,
        deliveryScanned: false,
        pickupAtLabel: { ar: 'منذ 22 د', en: '22m ago' },
        deliveryAtLabel: null,
      }),
    ],
    [
      {
        id: 't1',
        title: { ar: 'مسح الاستلام', en: 'Pickup scan' },
        detail: {
          ar: 'DRV-091 استلم البوكس',
          en: 'DRV-091 picked up the box',
        },
        time: { ar: 'منذ 22 د', en: '22m ago' },
        tone: 'success',
        done: true,
      },
      {
        id: 't2',
        title: { ar: 'في الطريق', en: 'En route' },
        detail: { ar: 'جاري التوصيل', en: 'Delivering now' },
        time: { ar: 'الآن', en: 'Now' },
        tone: 'info',
        done: true,
      },
      {
        id: 't3',
        title: { ar: 'مسح التسليم', en: 'Delivery scan' },
        detail: {
          ar: 'متوقع خلال 28 دقيقة',
          en: 'Expected in 28 minutes',
        },
        time: { ar: 'قادم', en: 'Upcoming' },
        tone: 'warning',
        done: false,
      },
    ],
    {
      driver: driverInfo(
        'DRV-091',
        'حي النرجس',
        'Al Narjis',
        'آخر ظهور منذ 5 د',
        'Last ping 5m ago',
        1,
      ),
      zone: { ar: 'حي النرجس', en: 'Al Narjis' },
      tier: { ar: 'بلاتينيوم', en: 'Platinum' },
    },
  ),
};

export function buildFallbackHandoverDetail(
  orderCode: string,
): HandoverDetailData {
  const fromList = listByCode[orderCode];
  if (fromList) {
    return detailFromList(
      fromList,
      Array.from({ length: fromList.boxCount }, (_, i) =>
        makeBox(orderCode, i + 1, 'full', {
          pickupScanned: fromList.status !== 'awaiting-pickup',
          deliveryScanned: fromList.status === 'delivered',
          pickupAtLabel: fromList.pickedUpAtLabel,
          deliveryAtLabel:
            fromList.status === 'delivered'
              ? { ar: 'اليوم', en: 'Today' }
              : null,
        }),
      ),
      [
        {
          id: 't1',
          title: { ar: 'حالة التسليم', en: 'Handover status' },
          detail: fromList.statusHint,
          time: { ar: 'الآن', en: 'Now' },
          tone: 'info',
          done: true,
        },
      ],
      {
        driver: driverInfo(
          fromList.driverCode,
          '—',
          '—',
          '—',
          '—',
          fromList.boxCount,
        ),
        zone: { ar: '—', en: '—' },
        tier: { ar: '—', en: '—' },
      },
    );
  }

  return {
    id: `fallback-${orderCode}`,
    orderCode,
    batchCode: 'BATCH-—',
    status: 'awaiting-pickup',
    customerMaskedId: 'CUS-•••000',
    driverCode: 'DRV-000',
    barcodeCode: `MM-${orderCode.replace('ORD-', '')}-B1`,
    mealSummary: { ar: 'طلب تسليم', en: 'Handover order' },
    programLabel: { ar: '—', en: '—' },
    bundleLabel: { ar: '—', en: '—' },
    tierLabel: { ar: '—', en: '—' },
    boxCount: 1,
    shiftLabel: { ar: '—', en: '—' },
    deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
    deliverySlotLabel: { ar: '—', en: '—' },
    deliveryZoneLabel: { ar: '—', en: '—' },
    etaLabel: { ar: '—', en: '—' },
    pickedUpAtLabel: null,
    privacyNote: {
      ar: 'بيانات العميل الشخصية مخفية.',
      en: 'Customer personal data is hidden.',
    },
    pickupHint: {
      ar: 'لا توجد بيانات تفصيلية لهذا الطلب',
      en: 'No detailed handover data for this order',
    },
    driver: driverInfo('DRV-000', '—', '—', '—', '—', 1),
    facts: [],
    checklist: [],
    boxes: [
      makeBox(orderCode || 'ORD-0000', 1, 'lunch', {
        pickupScanned: false,
        deliveryScanned: false,
        pickupAtLabel: null,
        deliveryAtLabel: null,
      }),
    ],
    timeline: [],
    labelsRoute: '/restaurant/orders/labels',
    listRoute: '/restaurant/orders/handover',
    orderDetailRoute: `/restaurant/orders/detail/${orderCode}`,
  };
}
