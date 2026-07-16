import { LocalizedText } from '../../overview/models/restaurant-overview.model';

/** Lifecycle of a multi-stop delivery trip (dispatch officer flow). */
export type TripStatus =
  | 'draft'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TripFilter = 'all' | TripStatus;

export type TripStopStatus =
  | 'pending'
  | 'picked_up'
  | 'delivered'
  | 'failed';

export interface TripSummary {
  id: string;
  label: LocalizedText;
  value: number;
}

/** A stop = one customer delivery (may include multiple boxes). No PII. */
export interface TripStop {
  id: string;
  orderCode: string;
  customerMaskedId: string;
  zoneLabel: LocalizedText;
  mealSummary: LocalizedText;
  boxCount: number;
  slotLabel: LocalizedText;
  status: TripStopStatus;
}

export interface TripDriverOption {
  id: string;
  name: LocalizedText;
  code: string;
  vehicleLabel: LocalizedText;
  tripsToday: number;
  available: boolean;
}

/** Ready box/order waiting to be placed on a trip. */
export interface TripCandidateStop {
  id: string;
  orderCode: string;
  customerMaskedId: string;
  zoneLabel: LocalizedText;
  mealSummary: LocalizedText;
  boxCount: number;
  slotLabel: LocalizedText;
  shiftLabel: LocalizedText;
}

export interface DeliveryTrip {
  id: string;
  code: string;
  status: TripStatus;
  shiftLabel: LocalizedText;
  zoneLabel: LocalizedText;
  driverId: string | null;
  driverName: LocalizedText | null;
  driverCode: string | null;
  dispatcherName: LocalizedText;
  stops: TripStop[];
  boxCount: number;
  customerCount: number;
  createdAtLabel: LocalizedText;
  startedAtLabel: LocalizedText | null;
  completedAtLabel: LocalizedText | null;
  note?: LocalizedText;
}

export interface RestaurantTripsData {
  title: LocalizedText;
  subtitle: LocalizedText;
  dateLabel: LocalizedText;
  note: LocalizedText;
  summaries: TripSummary[];
  trips: DeliveryTrip[];
  candidates: TripCandidateStop[];
}
