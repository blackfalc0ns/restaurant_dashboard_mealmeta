export type RestaurantLoginViewState = 'idle' | 'submitting' | 'error';

export interface RestaurantLoginRequest {
  identifier: string;
  password: string;
  rememberSession: boolean;
}

export interface RestaurantLoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  restaurantId: string;
  isApproved: boolean;
  hasApprovedMenu: boolean;
  hasServiceArea: boolean;
}
