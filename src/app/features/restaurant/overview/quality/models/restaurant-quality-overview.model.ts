import { LocalizedText } from '../../models/restaurant-overview.model';

export interface QualityMetric {
  id: string;
  label: LocalizedText;
  value: string;
  hint: LocalizedText;
  tone: 'primary' | 'accent' | 'warning' | 'neutral';
  icon: string;
  route: string;
}

export interface QualityCategoryScore {
  id: string;
  label: LocalizedText;
  score: number;
  percent: number;
}

export interface QualityComplaintItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  slaLabel: LocalizedText;
  tone: 'critical' | 'warning' | 'info';
  route: string;
}

export interface QualityRatingItem {
  id: string;
  mealName: LocalizedText;
  comment: LocalizedText;
  stars: number;
  timeLabel: LocalizedText;
}

export interface QualityTrendPoint {
  label: LocalizedText;
  rating: number;
  complaints: number;
}

export interface RestaurantQualityOverviewData {
  title: LocalizedText;
  subtitle: LocalizedText;
  averageRating: number;
  ratingsCount: number;
  metrics: QualityMetric[];
  categories: QualityCategoryScore[];
  distribution: number[];
  complaints: QualityComplaintItem[];
  recentRatings: QualityRatingItem[];
  trend: QualityTrendPoint[];
}
