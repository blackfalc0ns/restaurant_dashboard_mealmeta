import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export function provideRestaurantHttp() {
  return provideHttpClient(withInterceptorsFromDi());
}
