import { ArchiveOrderItem } from '../models/archive.model';
import { DailyOrderItem } from '../../daily-orders/models/daily-orders.model';
import { HandoverListItem } from '../../handover/models/handover.model';
import { HandoverDetailData } from '../../handover/models/handover.model';

export function archiveItemFromHandoverList(
  order: HandoverListItem,
): ArchiveOrderItem {
  return {
    id: `ar-live-${order.orderCode}`,
    orderCode: order.orderCode,
    batchCode: order.batchCode,
    customerMaskedId: order.customerMaskedId,
    driverCode: order.driverCode,
    barcodeCode: order.barcodeCode,
    mealSummary: order.mealSummary,
    programLabel: order.programLabel,
    bundleLabel: order.bundleLabel,
    boxCount: order.boxCount,
    shift: order.shift,
    shiftLabel: order.shiftLabel,
    deliveryDateLabel: order.deliveryDateLabel,
    deliverySlotLabel: order.deliverySlotLabel,
    closedAtLabel: { ar: 'أُرشف الآن', en: 'Archived just now' },
    period: 'today',
    status: 'delivered',
    statusHint: {
      ar: 'نُقل من التسليم إلى الأرشيف',
      en: 'Moved from handover to archive',
    },
    settlementLabel: {
      ar: 'بانتظار التسوية',
      en: 'Awaiting settlement',
    },
    ratingLabel: null,
    route: `/restaurant/orders/detail/${order.orderCode}`,
  };
}

export function archiveItemFromHandoverDetail(
  data: HandoverDetailData,
): ArchiveOrderItem {
  return {
    id: `ar-live-${data.orderCode}`,
    orderCode: data.orderCode,
    batchCode: data.batchCode,
    customerMaskedId: data.customerMaskedId,
    driverCode: data.driverCode,
    barcodeCode: data.barcodeCode,
    mealSummary: data.mealSummary,
    programLabel: data.programLabel,
    bundleLabel: data.bundleLabel,
    boxCount: data.boxCount,
    shift: 'noon',
    shiftLabel: data.shiftLabel,
    deliveryDateLabel: data.deliveryDateLabel,
    deliverySlotLabel: data.deliverySlotLabel,
    closedAtLabel: { ar: 'أُرشف الآن', en: 'Archived just now' },
    period: 'today',
    status: 'delivered',
    statusHint: {
      ar: 'نُقل من تفاصيل التسليم إلى الأرشيف',
      en: 'Moved from handover detail to archive',
    },
    settlementLabel: {
      ar: 'بانتظار التسوية',
      en: 'Awaiting settlement',
    },
    ratingLabel: null,
    route: data.orderDetailRoute,
  };
}

export function archiveItemFromDailyOrder(
  order: DailyOrderItem,
): ArchiveOrderItem {
  const driver =
    order.driverLabel != null
      ? order.driverLabel.en.match(/DRV-\d+/)?.[0] ??
        order.driverLabel.ar.match(/DRV-\d+/)?.[0] ??
        null
      : null;

  return {
    id: `ar-live-${order.orderCode}`,
    orderCode: order.orderCode,
    batchCode: order.batchCode,
    customerMaskedId: `CUS-•••${order.orderCode.slice(-3)}`,
    driverCode: driver,
    barcodeCode: order.barcodeReady
      ? `MM-${order.orderCode.replace('ORD-', '')}-B1`
      : null,
    mealSummary: order.mealName,
    programLabel: order.programLabel,
    bundleLabel: { ar: 'باقة', en: 'Package' },
    boxCount: order.boxCount,
    shift: order.shift,
    shiftLabel: order.shiftLabel,
    deliveryDateLabel: { ar: 'اليوم', en: 'Today' },
    deliverySlotLabel: order.windowLabel,
    closedAtLabel: { ar: 'أُرشف الآن', en: 'Archived just now' },
    period: 'today',
    status: 'delivered',
    statusHint: {
      ar: 'نُقل من طلبات اليوم إلى الأرشيف',
      en: 'Moved from daily orders to archive',
    },
    settlementLabel: {
      ar: 'بانتظار التسوية',
      en: 'Awaiting settlement',
    },
    ratingLabel: null,
    route: order.route,
  };
}
