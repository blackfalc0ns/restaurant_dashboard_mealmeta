export interface RestaurantNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  route?: string;
  icon: string;
  badge?: number;
  queryParams?: Record<string, string>;
  children?: RestaurantNavItem[];
}

export interface RestaurantNavSection {
  id: string;
  labelAr: string;
  labelEn: string;
  icon?: string;
  items: RestaurantNavItem[];
}
