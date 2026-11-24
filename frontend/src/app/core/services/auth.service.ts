import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api/api-config.token';
import { isPlatformBrowser } from '@angular/common';
import {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
  VerificationChannel,
  VerifyCodesError,
  VerifyCodesPayload,
} from '../models/auth.model';
import { delay, map, Observable, of, switchMap, tap, throwError, timer } from 'rxjs';
import { MOCK_PASSWORD, MOCK_TOKENS, MOCK_USERS, MOCK_VERIFY_CODE } from '../mock/users.mock';
import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly financeService = inject(FinanceService);

  private readonly _currentUser = signal<User | null>(this.restoreUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  private readonly users: User[] = [...MOCK_USERS];

  constructor() {
    const restored = this._currentUser();

    if (restored) {
      const index = this.users.findIndex((user) => user.id === restored.id);

      if (index !== -1) {
        this.users[index] = restored;
      } else {
        this.users.push(restored);
      }
    }
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('refreshToken');
  }

  setTokens(tokens: AuthTokens): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  clearTokens(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  login(payload: LoginPayload): Observable<User> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const user = this.users.find((user) => user.email === normalizedEmail);

    if (!user || payload.password !== MOCK_PASSWORD) {
      return timer(400).pipe(
        switchMap(() => throwError(() => new Error('Неверный email или пароль'))),
      );
    }
    if (user.isBlocked) {
      return timer(400).pipe(switchMap(() => throwError(() => new Error('Аккаунт заблокирован'))));
    }
    return of({ user, tokens: MOCK_TOKENS }).pipe(
      delay(400),
      tap((res) => {
        this.setTokens(res.tokens);
        this._currentUser.set(res.user);
        this.saveSessions(res.user);
      }),
      map((res) => res.user),
    );
  }

  refreshToken(): Observable<AuthTokens> {
    if (!this.getRefreshToken()) {
      return throwError(() => new Error('Refresh token not set.'));
    } else {
      return of(MOCK_TOKENS).pipe(
        delay(300),
        tap((tokens) => this.setTokens(tokens)),
      );
    }
  }

  register(payload: RegisterPayload): Observable<User> {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPhone = payload.phone.replace(/[^\d+]/g, '');

    if (this.users.some((user) => user.email === normalizedEmail)) {
      return timer(400).pipe(
        switchMap(() => throwError(() => new Error('Аккаунт с таким email уже существует'))),
      );
    }
    if (this.users.some((user) => user.phone === normalizedPhone)) {
      return timer(400).pipe(
        switchMap(() =>
          throwError(() => new Error('Аккаунт с таким номером телефона уже существует')),
        ),
      );
    }

    const user: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      phone: normalizedPhone,
      role: 'user',
      kycStatus: 'none',
      isPhoneVerified: false,
      isEmailVerified: false,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    return of(user).pipe(
      delay(600),
      tap(() => {
        this.users.push(user);
        this.setTokens(MOCK_TOKENS);
        this._currentUser.set(user);
        this.saveSessions(user);
      }),
    );
  }

  verifyContacts(payload: VerifyCodesPayload): Observable<User> {
    const currentUser = this._currentUser();
    if (!currentUser) {
      return timer(400).pipe(
        switchMap(() => throwError(() => new Error('Пользователь не авторизован'))),
      );
    }

    const smsInvalid: boolean = payload.smsCode !== MOCK_VERIFY_CODE;
    const emailInvalid: boolean = payload.emailCode !== MOCK_VERIFY_CODE;

    if (emailInvalid || smsInvalid) {
      return timer(400).pipe(
        switchMap(() => throwError(() => new VerifyCodesError({ smsInvalid, emailInvalid }))),
      );
    }

    const updatedUser: User = {
      ...currentUser,
      isPhoneVerified: true,
      isEmailVerified: true,
    };

    return of(updatedUser).pipe(
      delay(400),
      tap(() => {
        this._currentUser.set(updatedUser);

        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        this.saveSessions(updatedUser);
      }),
    );
  }

  logout(): void {
    this.clearTokens();
    this._currentUser.set(null);
    this.financeService.clearHolds();

    if (this.isBrowser) {
      localStorage.removeItem('auth_user');
    }
  }

  private saveSessions(user: User): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private restoreUser(): User | null {
    if (!this.isBrowser || !this.getAccessToken() || !this.getRefreshToken()) {
      return null;
    }

    try {
      const raw = localStorage.getItem('auth_user');
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as User;
    } catch (e) {
      localStorage.removeItem('auth_user');
      1;
      return null;
    }
  }
}
