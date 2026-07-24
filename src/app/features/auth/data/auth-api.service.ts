import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RestaurantLoginRequest, RestaurantLoginResponse } from '../models/login.model';
import {
  RestaurantSendOtpRequest,
  RestaurantVerifyOtpRequest,
  RestaurantVerifyOtpResponse,
} from '../models/otp.model';
import { AUTH_DESIGN_MODE } from '../config/auth-design.config';

interface BackendAuthResponse {
  userId: string;
  email?: string | null;
  restaurantId?: string | null;
  accountStatus: string;
  roles: string[];
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantAuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/auth`;

  login(request: RestaurantLoginRequest): Observable<RestaurantLoginResponse> {
    if (!AUTH_DESIGN_MODE && (!request.identifier || !request.password)) {
      return throwError(() => new Error('يرجى إدخال اسم المستخدم وكلمة المرور'));
    }

    const email = request.identifier.includes('@') ? request.identifier.trim() : null;
    const phone = email ? null : request.identifier.trim();

    return this.http
      .post<BackendAuthResponse>(`${this.baseUrl}/login`, {
        email,
        phone,
        password: request.password,
      })
      .pipe(
        map((res) => ({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresAt: res.accessTokenExpiresAtUtc,
          restaurantId: res.restaurantId ?? '',
          isApproved: res.accountStatus === 'Active',
          hasApprovedMenu: false,
          hasServiceArea: false,
        })),
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(this.extractError(err))),
        ),
      );
  }

  sendOtp(request: RestaurantSendOtpRequest): Observable<void> {
    if (!AUTH_DESIGN_MODE && !request.email) {
      return throwError(() => new Error('يرجى إدخال البريد الإلكتروني'));
    }

    return this.http
      .post<void>(`${this.baseUrl}/forgot-password`, { email: request.email })
      .pipe(
        map(() => undefined),
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(this.extractError(err))),
        ),
      );
  }

  verifyOtp(request: RestaurantVerifyOtpRequest): Observable<RestaurantVerifyOtpResponse> {
    if (!AUTH_DESIGN_MODE && (!request.email || request.code.length !== 6)) {
      return throwError(() => new Error('يرجى إدخال رمز التحقق كاملاً'));
    }

    return this.http
      .post<void>(`${this.baseUrl}/verify-otp`, {
        destination: request.email,
        purpose: 'PasswordReset',
        code: request.code,
      })
      .pipe(
        map(() => ({ resetToken: request.code })),
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(this.extractError(err))),
        ),
      );
  }

  resetPassword(email: string, otpCode: string, newPassword: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/reset-password`, { email, otpCode, newPassword })
      .pipe(
        map(() => undefined),
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(this.extractError(err))),
        ),
      );
  }

  logout(refreshToken?: string | null): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, { refreshToken: refreshToken ?? null }).pipe(
      catchError(() => of(undefined)),
    );
  }

  private extractError(err: HttpErrorResponse): string {
    const detail = err.error?.detail ?? err.error?.title;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (err.status === 401) return 'اسم المستخدم أو كلمة المرور غير صحيحة';
    return 'تعذر إكمال العملية';
  }
}
