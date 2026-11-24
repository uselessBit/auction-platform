export type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type UserRole = 'user' | 'admin' | 'b2b';
export type AuthModalMode = 'login' | 'register' | 'verify';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly phone: string;
  readonly role: UserRole;
  readonly kycStatus: KycStatus;
  readonly isPhoneVerified: boolean;
  readonly isEmailVerified: boolean;
  readonly isBlocked: boolean;
  readonly createdAt: string; // ISO 8601
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthResponse {
  readonly user: User;
  readonly tokens: AuthTokens;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly email: string;
  readonly phone: string;
  readonly password: string;
}

export interface VerifyCodesPayload {
  readonly smsCode: string;
  readonly emailCode: string;
}

export interface VerifyCodesFieldErrors {
  readonly smsInvalid: boolean;
  readonly emailInvalid: boolean;
}

export class VerifyCodesError extends Error {
  constructor(readonly fields: VerifyCodesFieldErrors) {
    super('Неверный код подтверждения');
  }
}
