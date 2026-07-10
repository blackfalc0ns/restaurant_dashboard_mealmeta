import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChefHat,
  lucideChevronLeft,
  lucideChevronRight,
  lucideCircleCheckBig,
  lucideClock3,
  lucidePackageCheck,
  lucidePrinter,
  lucideSearch,
  lucideTruck,
  lucideUtensils,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

type DailyOrderStatus = 'confirmed' | 'preparing' | 'ready' | 'waiting-driver' | 'completed';
type DailyOrderStatusFilter = 'all' | DailyOrderStatus;
type DailyOrderShiftFilter = 'all' | 'morning' | 'afternoon';

interface DailyOrder {
  id: string;
  pickupTime: string;
  shift: Exclude<DailyOrderShiftFilter, 'all'>;
  mealAr: string;
  mealEn: string;
  count: number;
  customerRef: string;
  driverAr: string;
  driverEn: string;
  status: DailyOrderStatus;
  labelsReady: boolean;
}

interface StatusOption {
  id: DailyOrderStatusFilter;
  labelAr: string;
  labelEn: string;
}

@Component({
  selector: 'mm-daily-orders-page',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './daily-orders-page.component.html',
  styleUrl: './daily-orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChefHat,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCircleCheckBig,
      lucideClock3,
      lucidePackageCheck,
      lucidePrinter,
      lucideSearch,
      lucideTruck,
      lucideUtensils,
    }),
  ],
})
export class DailyOrdersPageComponent {
  readonly locale = inject(AppLocaleService);

  readonly query = signal('');
  readonly selectedStatus = signal<DailyOrderStatusFilter>('all');
  readonly selectedShift = signal<DailyOrderShiftFilter>('all');

  readonly statusOptions: StatusOption[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
    { id: 'preparing', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
    { id: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
    { id: 'waiting-driver', labelAr: 'بانتظار السائق', labelEn: 'Waiting for driver' },
    { id: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
  ];

  readonly orders = signal<DailyOrder[]>([
    {
      id: 'ORD-2481',
      pickupTime: '11:30',
      shift: 'morning',
      mealAr: 'دجاج مشوي، أرز وخضار',
      mealEn: 'Grilled chicken, rice & vegetables',
      count: 18,
      customerRef: 'MM-1082',
      driverAr: 'أحمد خالد',
      driverEn: 'Ahmed Khaled',
      status: 'preparing',
      labelsReady: true,
    },
    {
      id: 'ORD-2482',
      pickupTime: '12:15',
      shift: 'morning',
      mealAr: 'سلمون، بطاطا وسلطة',
      mealEn: 'Salmon, potatoes & salad',
      count: 12,
      customerRef: 'MM-1139',
      driverAr: 'محمد علي',
      driverEn: 'Mohamed Ali',
      status: 'ready',
      labelsReady: true,
    },
    {
      id: 'ORD-2483',
      pickupTime: '13:00',
      shift: 'afternoon',
      mealAr: 'باستا بالدجاج',
      mealEn: 'Chicken pasta',
      count: 9,
      customerRef: 'MM-1194',
      driverAr: 'لم يُعيّن بعد',
      driverEn: 'Not assigned yet',
      status: 'waiting-driver',
      labelsReady: true,
    },
    {
      id: 'ORD-2484',
      pickupTime: '14:20',
      shift: 'afternoon',
      mealAr: 'كفتة مشوية وأرز بسمتي',
      mealEn: 'Grilled kofta & basmati rice',
      count: 16,
      customerRef: 'MM-1210',
      driverAr: 'يوسف سمير',
      driverEn: 'Youssef Samir',
      status: 'confirmed',
      labelsReady: false,
    },
    {
      id: 'ORD-2485',
      pickupTime: '15:10',
      shift: 'afternoon',
      mealAr: 'سلطة سيزر بالدجاج',
      mealEn: 'Chicken Caesar salad',
      count: 7,
      customerRef: 'MM-1235',
      driverAr: 'عمر حسن',
      driverEn: 'Omar Hassan',
      status: 'completed',
      labelsReady: true,
    },
  ]);

  readonly filteredOrders = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    const status = this.selectedStatus();
    const shift = this.selectedShift();

    return this.orders().filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const matchesShift = shift === 'all' || order.shift === shift;
      const searchContent = [
        order.id,
        order.customerRef,
        order.mealAr,
        order.mealEn,
        order.driverAr,
        order.driverEn,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return matchesStatus && matchesShift && (!query || searchContent.includes(query));
    });
  });

  readonly totalMeals = computed(() =>
    this.orders().reduce((total, order) => total + order.count, 0),
  );
  readonly readyCount = computed(() =>
    this.orders().filter((order) => order.status === 'ready').length,
  );
  readonly activeCount = computed(() =>
    this.orders().filter((order) => order.status !== 'completed').length,
  );
  readonly missingLabelsCount = computed(() =>
    this.orders().filter((order) => !order.labelsReady).length,
  );

  text(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onShiftChange(event: Event): void {
    this.selectedShift.set((event.target as HTMLSelectElement).value as DailyOrderShiftFilter);
  }

  selectStatus(status: DailyOrderStatusFilter): void {
    this.selectedStatus.set(status);
  }

  countForStatus(status: DailyOrderStatusFilter): number {
    if (status === 'all') return this.orders().length;
    return this.orders().filter((order) => order.status === status).length;
  }

  statusLabel(status: DailyOrderStatus): string {
    const option = this.statusOptions.find((item) => item.id === status);
    return option ? this.text(option.labelAr, option.labelEn) : status;
  }

  statusIcon(status: DailyOrderStatus): string {
    const icons: Record<DailyOrderStatus, string> = {
      confirmed: 'lucideCheck',
      preparing: 'lucideChefHat',
      ready: 'lucidePackageCheck',
      'waiting-driver': 'lucideTruck',
      completed: 'lucideCircleCheckBig',
    };
    return icons[status];
  }

  nextActionLabel(status: DailyOrderStatus): string | null {
    const labels: Record<DailyOrderStatus, [string, string] | null> = {
      confirmed: ['بدء التحضير', 'Start preparation'],
      preparing: ['تحديد كجاهز', 'Mark as ready'],
      ready: ['بانتظار السائق', 'Wait for driver'],
      'waiting-driver': ['تأكيد التسليم', 'Confirm handover'],
      completed: null,
    };
    const label = labels[status];
    return label ? this.text(label[0], label[1]) : null;
  }

  advanceOrder(orderId: string): void {
    const nextStatus: Record<DailyOrderStatus, DailyOrderStatus> = {
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'waiting-driver',
      'waiting-driver': 'completed',
      completed: 'completed',
    };

    this.orders.update((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus[order.status] } : order,
      ),
    );
  }
}
