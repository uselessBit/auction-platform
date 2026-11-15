import { AuthResponse, AuthTokens, User } from '../models/auth.model';

export const MOCK_USER_VERIFIED: User = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c32345',
  email: 'alex.novik@yandex.by',
  phone: '+375291234567',
  role: 'user',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const MOCK_USER_NEW: User = {
  id: 'a2c4e6f8-1122-4334-8556-778899004120',
  email: 'novice@mail.ru',
  phone: '+375292223344',
  role: 'user',
  kycStatus: 'pending',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-05-10T14:20:00.000Z',
};

export const MOCK_USER_UNVERIFIED: User = {
  id: 'b3d5f7a9-2233-4455-9667-889900115501',
  email: 'unverified@mail.ru',
  phone: '+375447654321',
  role: 'user',
  kycStatus: 'none',
  isPhoneVerified: false,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2026-06-01T09:15:00.000Z',
};

export const MOCK_ADMIN: User = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'admin@secondrive.by',
  phone: '+375290000001',
  role: 'admin',
  kycStatus: 'approved',
  isPhoneVerified: true,
  isEmailVerified: true,
  isBlocked: false,
  createdAt: '2025-12-01T00:00:00.000Z',
};

export const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock-jwt-access-token-xyz123abc-valid-for-session',
  refreshToken: 'mock-jwt-refresh-token-abc789xyz-valid-for-refresh',
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER_VERIFIED,
  tokens: MOCK_TOKENS,
};
