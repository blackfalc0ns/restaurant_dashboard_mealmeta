import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Star filter buckets for restaurant ratings (F15). */
export type RatingFilter = 'all' | 'five' | 'four' | 'three' | 'low';

export interface RatingSummary {
  id: string;
  label: LocalizedText;
  value: string;
}

export interface MealRatingHighlight {
  id: string;
  mealName: LocalizedText;
  averageStars: number;
  ratingsCount: number;
}

export interface RestaurantRating {
  id: string;
  mealName: LocalizedText;
  comment: LocalizedText;
  stars: number;
  timeLabel: LocalizedText;
  /** Masked order ref — no customer PII (F15). */
  orderRef: string;
  programLabel: LocalizedText;
}

export interface RestaurantRatingsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  averageRating: number;
  ratingsCount: number;
  summaries: RatingSummary[];
  topMeals: MealRatingHighlight[];
  lowestMeals: MealRatingHighlight[];
  ratings: RestaurantRating[];
}
