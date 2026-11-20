import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api/api-config.token';
import { isPlatformBrowser } from '@angular/common';
import { AuthTokens, User } from '../models/auth.model';
import { delay, map, Observable, of, switchMap, tap, throwError, timer } from 'rxjs';
import { MOCK_PASSWORD, MOCK_TOKENS, MOCK_USERS } from '../mock/users.mock';
import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly financeService = inject(FinanceService);

  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

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

  login(email: string, password: string): Observable<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = MOCK_USERS.find((user) => user.email === normalizedEmail);

    if (!user || password !== MOCK_PASSWORD) {
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

  logout(): void {
    this.clearTokens();
    this._currentUser.set(null);
    this.financeService.clearHolds();
  }
}
