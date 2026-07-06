export type RestaurantLoginViewState = 'idle' | 'submitting' | 'error';

export interface RestaurantLoginRequest {
  identifier: string;
  password: string;
  rememberSession: boolean;
}

export interface RestaurantLoginResponse {
  accessToken: string;
  expiresAt: string;
  restaurantId: string;
  isApproved: boolean;
  hasApprovedMenu: boolean;
  hasServiceArea: boolean;
}
