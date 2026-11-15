export type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type UserRole = 'user' | 'admin' | 'b2b';

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
