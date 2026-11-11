import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api/api-config.token';
import { isPlatformBrowser } from '@angular/common';
import { AuthTokens, User } from '../models/auth.model';
import { delay, map, Observable, of, tap, throwError } from 'rxjs';
import { MOCK_AUTH_RESPONSE, MOCK_TOKENS } from '../mock/users.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly currentUser = signal<User | null>(null);
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
    return of(MOCK_AUTH_RESPONSE).pipe(
      delay(400),
      tap((res) => {
        this.setTokens(res.tokens);
        this.currentUser.set(res.user);
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
    this.currentUser.set(null);
  }
}
