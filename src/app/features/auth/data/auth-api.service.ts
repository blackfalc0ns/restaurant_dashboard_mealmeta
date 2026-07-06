import { RestaurantLoginRequest, RestaurantLoginResponse } from '../models/login.model';
import {
  RestaurantSendOtpRequest,
  RestaurantVerifyOtpRequest,
  RestaurantVerifyOtpResponse,
} from '../models/otp.model';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AUTH_DESIGN_MODE } from '../config/auth-design.config';

@Injectable({ providedIn: 'root' })
export class RestaurantAuthApiService {
  login(request: RestaurantLoginRequest): Observable<RestaurantLoginResponse> {
    if (!AUTH_DESIGN_MODE && (!request.identifier || !request.password)) {
      return throwError(() => new Error('يرجى إدخال اسم المستخدم وكلمة المرور'));
    }

    // محاكاة الاتصال بالسيرفر (Mock Response)
    // في الإنتاج، سيتم استخدام: this.http.post<RestaurantLoginResponse>('/api/restaurant/auth/login', request)
    const mockResponse: RestaurantLoginResponse = {
      accessToken: 'mock-restaurant-token-jwt-key-2026',
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours validity
      restaurantId: 'rest-partner-001',
      isApproved: true,
      hasApprovedMenu: true,
      hasServiceArea: true
    };

    if (request.password === 'error123') {
      return throwError(() => new Error('اسم المستخدم أو كلمة المرور غير صحيحة')).pipe(delay(1000));
    }

    return of(mockResponse).pipe(
      delay(1200) // لإعطاء واقعية وحركة تحميل ناعمة
    );
  }

  sendOtp(request: RestaurantSendOtpRequest): Observable<void> {
    if (!AUTH_DESIGN_MODE && !request.email) {
      return throwError(() => new Error('يرجى إدخال البريد الإلكتروني'));
    }

    return of(undefined).pipe(delay(900));
  }

  verifyOtp(request: RestaurantVerifyOtpRequest): Observable<RestaurantVerifyOtpResponse> {
    if (!AUTH_DESIGN_MODE && (!request.email || request.code.length !== 6)) {
      return throwError(() => new Error('يرجى إدخال رمز التحقق كاملاً'));
    }

    if (!AUTH_DESIGN_MODE && request.code !== '123456') {
      return throwError(() => new Error('رمز التحقق غير صحيح. حاول مرة أخرى.')).pipe(delay(800));
    }

    return of({ resetToken: 'mock-reset-token' }).pipe(delay(900));
  }
}
