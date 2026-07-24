import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { restaurantAuthInterceptor } from './interceptors/auth.interceptor';

export function provideRestaurantHttp() {
  return provideHttpClient(withInterceptors([restaurantAuthInterceptor]));
}
