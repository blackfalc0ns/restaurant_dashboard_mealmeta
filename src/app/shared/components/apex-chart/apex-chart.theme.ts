import type {
  ApexChart,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export const MM_CHART_COLORS = {
  primary: '#10b981',
  primaryDark: '#059669',
  navy: '#0f1d32',
  slate: '#64748b',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  violet: '#8b5cf6',
} as const;

export const MM_CHART_PALETTE = [
  MM_CHART_COLORS.primary,
  MM_CHART_COLORS.navy,
  MM_CHART_COLORS.amber,
  MM_CHART_COLORS.red,
  MM_CHART_COLORS.blue,
  MM_CHART_COLORS.violet,
  MM_CHART_COLORS.slate,
];

export function mmBaseChart(type: ApexChart['type'], height = 280): ApexChart {
  return {
    type,
    height,
    fontFamily: 'IBM Plex Sans Arabic, PingAR, Cairo, ui-sans-serif, system-ui, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
    locales: [
      {
        name: 'ar',
        options: {
          months: [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ],
          shortMonths: [
            'ينا',
            'فبر',
            'مار',
            'أبر',
            'ماي',
            'يون',
            'يول',
            'أغس',
            'سب',
            'أكت',
            'نوف',
            'ديس',
          ],
          days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
          shortDays: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
          toolbar: {
            exportToSVG: 'تحميل SVG',
            exportToPNG: 'تحميل PNG',
            menu: 'القائمة',
            selection: 'تحديد',
            selectionZoom: 'تكبير التحديد',
            zoomIn: 'تكبير',
            zoomOut: 'تصغير',
            pan: 'تحريك',
            reset: 'إعادة ضبط',
          },
        },
      },
    ],
    defaultLocale: 'ar',
  };
}

export function mmBaseGrid(): ApexGrid {
  return {
    borderColor: '#e2e8f0',
    strokeDashArray: 4,
    padding: { left: 8, right: 8 },
  };
}

export function mmBaseXAxis(categories: string[]): ApexXAxis {
  return {
    categories,
    labels: {
      style: {
        colors: MM_CHART_COLORS.slate,
        fontFamily: 'PingAR, Cairo, sans-serif',
        fontSize: '11px',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
}

export function mmBaseYAxis(): ApexYAxis {
  return {
    labels: {
      style: {
        colors: MM_CHART_COLORS.slate,
        fontFamily: 'PingAR, Cairo, sans-serif',
        fontSize: '11px',
      },
    },
  };
}

export function mmBaseStroke(curve: ApexStroke['curve'] = 'smooth'): ApexStroke {
  return { curve, width: 2 };
}

export function mmBaseLegend(): ApexLegend {
  return {
    position: 'top',
    horizontalAlign: 'right',
    fontFamily: 'PingAR, Cairo, sans-serif',
    fontSize: '12px',
    labels: { colors: MM_CHART_COLORS.navy },
  };
}

export function mmBaseTooltip(): ApexTooltip {
  return {
    theme: 'light',
    style: { fontFamily: 'PingAR, Cairo, sans-serif' },
  };
}

export function mmSparklineChart(): ApexChart {
  return {
    type: 'area',
    height: 48,
    sparkline: { enabled: true },
    fontFamily: 'PingAR, Cairo, sans-serif',
  };
}
