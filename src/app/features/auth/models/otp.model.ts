export type RestaurantOtpViewState = 'idle' | 'submitting' | 'error';

export interface RestaurantSendOtpRequest {
  email: string;
}

export interface RestaurantVerifyOtpRequest {
  email: string;
  code: string;
}

export interface RestaurantVerifyOtpResponse {
  resetToken: string;
}
